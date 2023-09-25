import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SocialLoginEntity } from '../../auth/entities/social-login.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, comment: '회원번호' })
  user_no: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false, comment: '서비스내에서 사용하는 유저명(ID로 로그인 한다면 실제 ID값)' })
  user_name: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: '0: id-pw, 1: social login' })
  login_type: number;

  @OneToMany(() => SocialLoginEntity, (socialLogin) => socialLogin.user)
  socialLogins: SocialLoginEntity[];
}
