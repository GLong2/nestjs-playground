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

      if (existedUser) {
        return existedUser;
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
    // 사용자 검증 및 JWT 발급 로직을 여기에 추가해야 합니다.
    // 예시: DB에서 사용자를 찾아서 비밀번호를 비교하고, 일치하면 JWT를 발급합니다.
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
      return { accessToken: token };
    } else {
      throw new InternalServerErrorException('email 또는 비밀번호가 일치하지 않습니다..');
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
    return this.jwtService.sign(payload, { secret: process.env.JWT_KEY });
  }

  async validateUser(payload: any): Promise<any> {
    // 이 예제에서는 실제 사용자 정보가 없으므로 간단하게 payload를 반환합니다.
    // 실제로는 DB에서 사용자를 찾아 검증해야 합니다.
    return payload;
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

      if (existedUser) {
        throw new InternalServerErrorException('해당 사용자는 이미 존재하는 사용자입니다.');
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
    return `This action returns all user`;
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
