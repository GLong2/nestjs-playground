import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { SocialLoginEntity } from './entities/social-login.entity';
import { DataSource, Repository } from 'typeorm';
import { getSocialCode } from './helper/user.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(SocialLoginEntity) private readonly socialLoginRepository: Repository<SocialLoginEntity>,
    private dataSource: DataSource,
  ) {}

  async socialLogin(loginData: any) {
    const result = await this.dataSource.transaction(async (manager) => {
      const existedUser = await this.checkUserID(loginData.email);

      if (existedUser) {
        return existedUser;
      }

      const user = new UserEntity();
      user.user_name = loginData.email;
      user.login_type = 1;

      const createdUser = await manager.save(user);

      const socialLogin = new SocialLoginEntity();
      socialLogin.social_code = getSocialCode(loginData.provider);
      socialLogin.external_id = loginData.id;
      socialLogin.access_token = loginData.accessToken;
      socialLogin.user = createdUser;

      await manager.save(socialLogin);

      return createdUser;
    });

    return result;
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

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
