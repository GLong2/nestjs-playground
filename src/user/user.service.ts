import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SocialLogin } from './entities/social-login.entity';
import { DataSource, Repository } from 'typeorm';
import { getSocialCode } from './helper/user.helper';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserPassword } from './entities/user-password.entity';
import * as uuid from 'uuid';
import { UserProfile } from './entities/user-profile.entity';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { LogInDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(SocialLogin) private readonly socialLoginRepository: Repository<SocialLogin>,
    @InjectRepository(UserPassword) private readonly userPasswordRepository: Repository<UserPassword>,
    @InjectRepository(UserProfile) private readonly userProfileRepository: Repository<UserProfile>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async socialLogin(loginData: any) {
    const token = await this.dataSource.transaction(async (manager) => {
      const existedUser = await this.checkUserID(loginData.email);

      if (existedUser && existedUser.login_type === 1) {
        const existedSocialLogin = await this.socialLoginRepository.findOne({
          where: {
            user: { user_no: existedUser.user_no },
          },
        });
        existedSocialLogin.jti = loginData.jti;
        await manager.save(existedSocialLogin);
        return loginData.jwt;
      } else if (existedUser && existedUser.login_type === 0) {
        throw new InternalServerErrorException('해당 Email은 이미 다른 로그인 방식으로 가입되어 있습니다.');
      }

      const user = new User();
      user.user_name = loginData.email;
      user.login_type = 1;

      const createdUser = await manager.save(user);

      const socialLogin = new SocialLogin();
      socialLogin.social_code = getSocialCode(loginData.provider);
      socialLogin.external_id = loginData.id;
      socialLogin.jti = loginData.jti;
      socialLogin.user = createdUser;

      await manager.save(socialLogin);

      return loginData.jwt;
    });

    return token;
  }

  async login(loginDto: LogInDto) {
    const user = await this.checkUserID(loginDto.email);

    if (!user) {
      throw new InternalServerErrorException('해당 사용자는 존재하지 않는 사용자입니다.');
    }

    const user_no = user.user_no;
    const exitedUserPassword = await this.userPasswordRepository.findOne({
      where: {
        user: { user_no: user_no },
      },
      relations: ['user'],
    });

    const isValidPassword = await this.comparePasswords(loginDto.password, exitedUserPassword.password);
    if (!isValidPassword) {
      throw new InternalServerErrorException('email 또는 비밀번호가 일치하지 않습니다.');
    }

    const jti = uuid.v4();
    const loginType = 0;
    const token = await this.createToken(loginDto.email, loginType, jti);
    await this.userProfileRepository.update({ user: { user_no: user_no } }, { jti: jti });
    return token;
  }

  async checkUserID(user_name: string) {
    if (!user_name) {
      return null;
    }

    const user = await this.usersRepository.findOne({
      where: { user_name },
    });

    return user;
  }

  async checkEmail(email: string) {
    if (!email) {
      throw new InternalServerErrorException('email을 입력해주세요.');
    }

    const user = await this.usersRepository.findOne({
      where: { user_name: email },
    });

    if (!user) {
      return '사용 가능한 email입니다.';
    } else {
      throw new InternalServerErrorException('해당 email은 이미 존재하는 email입니다.');
    }
  }

  async createToken(email: string, loginType: number, jti: string) {
    const payload = { email, loginType };
    return this.jwtService.sign(payload, { secret: process.env.JWT_KEY, expiresIn: '60m', jwtid: jti });
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.checkUserID(payload.email);

    if (!user) {
      throw new InternalServerErrorException('해당 사용자는 존재하지 않는 사용자입니다.');
    }

    const userInfo =
      payload.loginType === 0 ? await this.userProfileRepository.findOne({ where: { user: { user_no: user.user_no } } }) : await this.socialLoginRepository.findOne({ where: { user: { user_no: user.user_no } } });

    if (!userInfo) {
      throw new InternalServerErrorException('해당 사용자의 정보가 존재하지 않습니다.');
    }

    if (payload.jti != userInfo.jti) {
      throw new UnauthorizedException('다른 기기에서 로그인 되었습니다.');
    }

    return user;
  }

  async hashPassword(password: string): Promise<any> {
    const salt = await bcrypt.genSalt();
    const result = {
      hashedPassword: await bcrypt.hash(password, salt),
      salt: salt,
    };
    return result;
  }

  async comparePasswords(newPassword: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(newPassword, hashPassword);
  }

  async create(signUpDto: SignUpDto) {
    const result = await this.dataSource.transaction(async (manager) => {
      const existedUser = await this.checkUserID(signUpDto.email);

      if (existedUser && existedUser.login_type === 0) {
        throw new InternalServerErrorException('해당 Email은 이미 가입되어 있습니다.');
      } else if (existedUser && existedUser.login_type === 1) {
        throw new InternalServerErrorException('해당 Email은 이미 다른 로그인 방식으로 가입되어 있습니다.');
      }

      const user = new User();
      user.user_name = signUpDto.email;
      user.login_type = 0;
      const createdUser = await manager.save(user);

      const { hashedPassword, salt } = await this.hashPassword(signUpDto.password);
      const password = new UserPassword();
      password.password = hashedPassword;
      password.salt = salt;
      password.user = createdUser;
      await manager.save(password);

      const userProfile = new UserProfile();
      userProfile.first_name = signUpDto.first_name;
      userProfile.last_name = signUpDto.last_name;
      userProfile.gender = signUpDto.gender;
      userProfile.user = createdUser;
      await manager.save(userProfile);

      return '정상적으로 생성 되었습니다.';
    });

    return result;
  }
  findAll() {
    return this.usersRepository.find();
  }
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto} user`;
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
