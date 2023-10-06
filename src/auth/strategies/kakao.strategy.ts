// kakao.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production' ? 'https://hong-ground.com/api/auth/kakao/callback' : 'http://localhost:3000/auth/kakao/callback',
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
      accessToken: accessToken,
      refreshToken: refreshToken,
      // email: profile._json && profile._json.kaccount_email,
      // profileImage: profile._json && profile._json.properties.profile_image,
    };

    done(null, user);
  }
}
