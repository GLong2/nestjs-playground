import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { combHelloHtml } from './helper/auth.helper';
import { UserService } from '../user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('logout/:socialType')
  logout(@Req() req, @Res() res, @Param('socialType') socialType: string) {
    if (socialType.indexOf('google') > -1) {
      // TODO
    } else if (socialType.indexOf('kakao') > -1) {
      const redirectURL = process.env.NODE_ENV === 'production' ? 'https://hong-ground.com/api/auth/kakao/logout/callback' : 'http://localhost:3000/auth/kakao/logout/callback';
      const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${redirectURL}`;
      return res.redirect(kakaoLogoutUrl);
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Google로 리다이렉트
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    // 구글 인증 후 콜백 처리
    // JWT 발행 또는 다른 페이지로 리다이렉트 등
    const result = await this.userService.socialLogin(req.user);
    res.cookie('auth_token', result.accessToken, { httpOnly: true, secure: true });
    return res.redirect('https://localhost/auth/google');
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    // 여기로 리다이렉트되지 않음
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req, @Res() res) {
    // 로그인 성공 후의 동작
    // 예를 들어: 토큰 발급 및 리다이렉트
    const result = await this.userService.socialLogin(req.user);
    res.cookie('auth_token', result.accessToken, { httpOnly: true, secure: true });
    return res.redirect('https://localhost/auth/kakao');
  }

  @Get('kakao/logout/callback')
  kakaoLogoutCallback(@Req() req, @Res() res) {
    return res.redirect('https://localhost');
  }

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }) {
    const createUserDto = {
      user_name: body.email,
      login_type: 0,
    };
    const result = await this.userService.create(createUserDto, body.password);
    return result;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const accessToken = await this.userService.login(body.email, body.password);
    return { accessToken };
  }
}
