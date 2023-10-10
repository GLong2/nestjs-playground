import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { SocialLogin } from './social-login.entity';
import { UserPassword } from './user-password.entity';
import { UserProfile } from './user-profile.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, comment: '회원번호' })
  user_no: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false, comment: '서비스내에서 사용하는 유저명(ID로 로그인 한다면 실제 ID값)' })
  user_name: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '0: id-pw, 1: social login' })
  login_type: number;

  @OneToOne(() => SocialLogin, (socialLogin) => socialLogin.user)
  socialLogin: SocialLogin;

  @OneToOne(() => UserPassword, (password) => password.user)
  password: UserPassword;

  @OneToOne(() => UserProfile, (user_profile) => user_profile.user)
  user_profile: UserProfile;
}
