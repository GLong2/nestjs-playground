import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { combHelloHtml } from './helper/auth.helper';
import { UserService } from '../user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('logout')
  logout(@Req() req, @Res() res) {
    console.log();
    const redirectURL = 'http://localhost:3000/auth/kakao/logout/callback';
    const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${redirectURL}`;
    return res.redirect(kakaoLogoutUrl);
    // if (req.url.indexOf('google') > -1) {
    //   console.log('google logout');
    // } else if (req.url.indexOf('kakao') > -1) {
    //   const redirectURL = 'http://localhost:3000/auth/kakao/logout/callback';
    //   const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${redirectURL}`;
    //   return res.redirect(kakaoLogoutUrl);
    // }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Google로 리다이렉트
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req) {
    // 구글 인증 후 콜백 처리
    // JWT 발행 또는 다른 페이지로 리다이렉트 등
    const user: any = await this.userService.socialLogin(req.user);
    return combHelloHtml(user.user_name);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    // 여기로 리다이렉트되지 않음
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req) {
    // 로그인 성공 후의 동작
    // 예를 들어: 토큰 발급 및 리다이렉트
    const user: any = await this.userService.socialLogin(req.user);
    return combHelloHtml(user.user_name);
  }

  @Get('logout/callback')
  kakaoLogoutCallback(@Req() req, @Res() res) {
    // 로그아웃 처리 후의 로직 (예: 홈페이지로 리다이렉트)
    return res.redirect('/kakao');
  }
}
