import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '서비스내에서 사용하는 유저명(ID로 로그인 한다면 실제 ID값)', required: true })
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ description: '0: id-pw, 1: social login', required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  login_type?: number;
}
