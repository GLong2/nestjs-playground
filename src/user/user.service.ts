import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SocialLogin } from './entities/social-login.entity';
import { DataSource, Repository } from 'typeorm';
import { getSocialCode } from './helper/user.helper';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Password } from './entities/password.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(SocialLogin) private readonly socialLoginRepository: Repository<SocialLogin>,
    @InjectRepository(Password) private readonly passwordRepository: Repository<Password>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async socialLogin(loginData: any) {
    const result = await this.dataSource.transaction(async (manager) => {
      const existedUser = await this.checkUserID(loginData.email);

      if (existedUser && existedUser.login_type === 1) {
        return existedUser;
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
      socialLogin.access_token = loginData.accessToken;
      socialLogin.user = createdUser;

      await manager.save(socialLogin);

      return createdUser;
    });

    return result;
  }

  async login(email: string, password: string) {
    const user = await this.checkUserID(email);

    if (!user) {
      throw new InternalServerErrorException('해당 사용자는 존재하지 않는 사용자입니다.');
    }

    const user_no = user.user_no;
    const exitedPassword = await this.passwordRepository.findOne({
      where: {
        user: { user_no: user_no },
      },
      relations: ['user'],
    });
    const isValidPassword = await this.comparePasswords(password, exitedPassword.password);
    if (isValidPassword) {
      const token = await this.createToken(email);
      return token;
    } else {
      throw new InternalServerErrorException('email 또는 비밀번호가 일치하지 않습니다.');
    }
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

  async createToken(email: string) {
    const payload = { email };
    return this.jwtService.sign(payload, { secret: process.env.JWT_KEY, expiresIn: '60m' });
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.checkUserID(payload.email);

    if (!user) {
      throw new InternalServerErrorException('해당 사용자는 존재하지 않는 사용자입니다.');
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

  async create(createUserDto: CreateUserDto, userPassword: string) {
    const result = await this.dataSource.transaction(async (manager) => {
      const existedUser = await this.checkUserID(createUserDto.user_name);

      if (existedUser && existedUser.login_type === 0) {
        return existedUser;
      } else if (existedUser && existedUser.login_type === 1) {
        throw new InternalServerErrorException('해당 Email은 이미 다른 로그인 방식으로 가입되어 있습니다.');
      }

      const user = new User();
      user.user_name = createUserDto.user_name;
      user.login_type = createUserDto.login_type;
      const createdUser = await manager.save(user);

      const { hashedPassword, salt } = await this.hashPassword(userPassword);
      const password = new Password();
      password.password = hashedPassword;
      password.salt = salt;
      password.user = createdUser;
      await manager.save(password);

      return createdUser;
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
    return `This action updates a #${id} user`;
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
