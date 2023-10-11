import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('social_login')
export class SocialLogin {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, comment: '고유 식별 값' })
  social_login_id: number;

  @Column({ type: 'tinyint', unsigned: true, comment: '1: apple, 2: google, 3: facebook, 4: kakao, 5: naver' })
  social_code: number;

  @Column({ type: 'varchar', length: 64, comment: 'oauth_external_id' })
  external_id: string;

  @Column({ type: 'varchar', length: 256, comment: 'jti' })
  jti: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', comment: '갱신일자' })
  update_date: Date;

  @OneToOne(() => User, (user) => user.socialLogin)
  @JoinColumn({ name: 'user_no' })
  user: User;
}
