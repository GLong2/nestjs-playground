import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('user_password')
export class UserPassword {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, comment: '고유값' })
  password_id: number;

  @Column({ type: 'varchar', length: 128, comment: 'hash 값' })
  salt: string;

  @Column({ type: 'varchar', length: 128, comment: 'SHA-512 단방향 암호화' })
  password: string;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', comment: '암호변경일' })
  update_date: Date;

  @OneToOne(() => User, (user) => user.password)
  @JoinColumn({ name: 'user_no' })
  user: User;
}
