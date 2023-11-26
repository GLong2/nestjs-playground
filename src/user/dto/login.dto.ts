import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckEmailDto {
  @ApiProperty({ required: true, description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;
}
