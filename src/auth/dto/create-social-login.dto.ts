import { IsNumber, IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialLoginDto {
  @ApiProperty({ description: '유저 번호' })
  @IsNumber()
  @IsNotEmpty()
  user_no: number;

  @ApiProperty({ description: '1: apple, 2: google, 3: facebook, 4: kakao, 5: naver', enum: [1, 2, 3, 4, 5] })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  social_code: number;

  @ApiProperty({ description: 'oauth_external_id', maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  external_id: string;

  @ApiProperty({ description: 'access token', maxLength: 256 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  access_token: string;

  // `update_date`는 자동으로 생성되는 필드이므로 DTO에 포함하지 않음

  // `user` 필드는 DTO에서 관리하지 않는 것으로 가정하며, 서비스 레벨에서 처리
}
