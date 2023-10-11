import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import * as uuid from 'uuid';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_PATH}/api/auth/kakao/callback`,
      scope: ['account_email'],
      passReqToCallback: true,
    });
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile, done) {
    // 사용자 데이터베이스에서 사용자 조회 또는 생성 후 반환
    const user = {
      id: profile.id,
      email: profile._json.kakao_account.email,
      username: profile.username,
      provider: profile.provider,
      jti: null,
      jwt: null,
      // email: profile._json && profile._json.kaccount_email,
      // profileImage: profile._json && profile._json.properties.profile_image,
    };
    const jti = uuid.v4();
    const loginType = 1;
    const jwt = await this.userService.createToken(user.email, loginType, jti);
    user.jti = jti;
    user.jwt = jwt;
    done(null, user);
  }
}
