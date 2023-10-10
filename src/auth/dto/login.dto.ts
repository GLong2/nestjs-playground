import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty({ required: true, description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({ required: true, description: 'password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
