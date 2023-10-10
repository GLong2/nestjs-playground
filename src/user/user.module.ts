import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SocialLogin } from './entities/social-login.entity';
import { JwtService } from '@nestjs/jwt';
import { Password } from './entities/password.entity';
import { UserProfile } from './entities/user-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SocialLogin, Password, UserProfile])],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
