import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('social_login')
export class SocialLoginEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, comment: '고유 식별 값' })
  social_login_id: number;

  @Column({ type: 'int', unsigned: true, comment: '유저 번호' })
  user_no: number;

  @Column({ type: 'tinyint', unsigned: true, comment: '1: apple, 2: google, 3: facebook, 4: kakao, 5: naver' })
  social_code: number;

  @Column({ type: 'varchar', length: 64, comment: 'oauth_external_id' })
  external_id: string;

  @Column({ type: 'varchar', length: 256, comment: 'access token' })
  access_token: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', comment: '갱신일자' })
  update_date: Date;

  @ManyToOne(() => UserEntity, (user) => user.socialLogins)
  @JoinColumn({ name: 'user_no' })
  user: UserEntity;
}
