import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ required: true, description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({ required: true, description: 'password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ required: false, description: '이름' })
  @IsOptional()
  @IsString()
  @Length(1, 256)
  readonly first_name?: string;

  @ApiProperty({ required: false, description: '성' })
  @IsOptional()
  @IsString()
  @Length(1, 256)
  readonly last_name?: string;

  @ApiProperty({ required: false, description: '성별 M, F' })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  @IsIn(['M', 'F'], { message: 'Gender must be either M or F' })
  readonly gender?: 'M' | 'F';
}
