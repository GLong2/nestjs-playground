import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UserService } from '../../user/user.service';
import * as uuid from 'uuid';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // .env 또는 설정에서 가져온다
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // .env 또는 설정에서 가져온다
      callbackURL: `${process.env.BASE_PATH}/api/auth/google/callback`,
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
      jti: null,
      jwt: null,
    };
    const jti = uuid.v4();
    const loginType = 1;
    const jwt = await this.userService.createToken(user.email, loginType, jti);
    user.jti = jti;
    user.jwt = jwt;
    done(null, user);
  }
}
