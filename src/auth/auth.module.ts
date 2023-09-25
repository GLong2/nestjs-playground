import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLoginEntity } from './entities/social-login.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialLoginEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
