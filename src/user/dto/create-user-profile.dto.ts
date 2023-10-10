import { IsInt, IsString, IsOptional, Length, IsIn } from 'class-validator';

export class CreateUserProfileDTO {
  @IsInt()
  user_no: number;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  jti?: string;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  first_name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  last_name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  gender?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Y', 'N'])
  is_agreement_service?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Y', 'N'])
  is_agreement_policy?: string;
}
