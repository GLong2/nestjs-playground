import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { combHelloHtml } from './helper/auth.helper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Google로 리다이렉트
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req) {
    // 구글 인증 후 콜백 처리
    // JWT 발행 또는 다른 페이지로 리다이렉트 등
    return combHelloHtml(req.user.email);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    // 여기로 리다이렉트되지 않음
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  kakaoLoginCallback(@Req() req) {
    // 로그인 성공 후의 동작
    // 예를 들어: 토큰 발급 및 리다이렉트
    return combHelloHtml(req.user.nickname);
  }
}
