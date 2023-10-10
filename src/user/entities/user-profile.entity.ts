import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity'; // Assuming you have a User entity already defined.

@Entity('user_profile')
export class UserProfile {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  user_profile_id: number;

  @Column({ type: 'int', unsigned: true })
  user_no: number;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  jti: string | null;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  first_name: string | null;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  last_name: string | null;

  @Column({ type: 'char', length: 1, nullable: true, default: null })
  gender: string | null;

  @Column({ type: 'char', length: 1, default: 'N' })
  is_agreement_service: string;

  @Column({ type: 'char', length: 1, default: 'N' })
  is_agreement_policy: string;

  @UpdateDateColumn()
  update_date: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_no' })
  user: User;
}
