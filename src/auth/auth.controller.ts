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
      const redirectURL = `${process.env.BASE_PATH}/api/auth/kakao/logout/callback`;
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
  async googleLoginCallback(@Req() req) {
    // res.cookie('auth_token', result.accessToken, { httpOnly: true, secure: true });
    // const redirectURL = process.env.NODE_ENV === 'production' ? `https://hong-ground.com/social?token=${accessToken}&redirect=home` : `http://localhost:4000/social?token=${accessToken}&redirect=home`;
    const accessToken = await this.userService.socialLogin(req.user);
    return { accessToken };
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
  async kakaoLoginCallback(@Req() req) {
    // res.cookie('auth_token', result.accessToken, { httpOnly: true, secure: true });
    // const redirectURL = process.env.NODE_ENV === 'production' ? `https://hong-ground.com/social?token=${result.accessToken}&redirect=home` : `http://localhost:4000/social?token=${result.accessToken}&redirect=home`;
    const accessToken = await this.userService.socialLogin(req.user);
    return { accessToken };
  }

  @ApiExcludeEndpoint()
  @Get('kakao/logout/callback')
  kakaoLogoutCallback(@Req() req, @Res() res) {
    const redirectURL = `${process.env.BASE_PATH}`;
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
