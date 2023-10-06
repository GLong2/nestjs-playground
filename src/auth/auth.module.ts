import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, UserModule],
  controllers: [AuthController],
  providers: [GoogleStrategy, KakaoStrategy, JwtStrategy],
})
export class AuthModule {}
