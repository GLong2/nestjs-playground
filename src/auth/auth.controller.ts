import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @ApiExcludeEndpoint()
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

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Google로 리다이렉트
  }

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    // 구글 인증 후 콜백 처리
    // JWT 발행 또는 다른 페이지로 리다이렉트 등
    const result = await this.userService.socialLogin(req.user);
    // res.cookie('auth_token', result.accessToken, { httpOnly: true, secure: true });
    const redirectURL = process.env.NODE_ENV === 'production' ? `https://hong-ground.com/social?token=${result.accessToken}&redirect=home` : `http://localhost:4000/social?token=${result.accessToken}&redirect=home`;
    return res.redirect(redirectURL);
  }

  @ApiExcludeEndpoint()
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    // 여기로 리다이렉트되지 않음
  }

  @ApiExcludeEndpoint()
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req, @Res() res) {
    // 로그인 성공 후의 동작
    // 예를 들어: 토큰 발급 및 리다이렉트
    const result = await this.userService.socialLogin(req.user);
    // res.cookie('auth_token', result.accessToken, { httpOnly: true, secure: true });
    const redirectURL = process.env.NODE_ENV === 'production' ? `https://hong-ground.com/social?token=${result.accessToken}&redirect=home` : `http://localhost:4000/social?token=${result.accessToken}&redirect=home`;
    return res.redirect(redirectURL);
  }

  @ApiExcludeEndpoint()
  @Get('kakao/logout/callback')
  kakaoLogoutCallback(@Req() req, @Res() res) {
    const redirectURL = process.env.NODE_ENV === 'production' ? `https://hong-ground.com/` : `http://localhost:4000/`;
    return res.redirect(redirectURL);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const result = await this.userService.create(signUpDto);
    return result;
  }

  @Post('login')
  async login(@Body() LoginDto: LogInDto) {
    const accessToken = await this.userService.login(LoginDto.email, LoginDto.password);
    return { accessToken };
  }
}
