import { IsNotEmpty, IsString, Length, IsInt } from 'class-validator';

export class CreatePasswordDto {
  @IsInt()
  @IsNotEmpty()
  user_no: number; // UserEntity에 연결된 ID를 의미합니다.

  @IsString()
  @Length(1, 128)
  @IsNotEmpty()
  salt: string;

  @IsString()
  @Length(1, 128)
  @IsNotEmpty()
  password: string; // 실제 비밀번호의 해시 값을 의미합니다.
}
