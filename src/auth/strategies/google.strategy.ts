import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // .env 또는 설정에서 가져온다
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // .env 또는 설정에서 가져온다
      callbackURL: process.env.NODE_ENV === 'production' ? 'https://hong-ground.com/api/auth/google/callback' : 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done) {
    // 사용자 정보를 데이터베이스와 일치시키거나 사용자 생성
    // profile 객체에는 사용자의 Google 정보가 포함
    const { id, name, emails, provider } = profile;
    const user = {
      id: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      provider: provider,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    done(null, user);
  }
}
