import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  // @ApiProperty({ required: true, description: 'No' })
  // @IsNotEmpty()
  // @IsString()
  // readonly No: string;

  @ApiProperty({ required: true, description: 'FirstName' })
  @IsNotEmpty()
  @IsString()
  readonly FirstName: string;

  @ApiProperty({ required: true, description: 'LastName' })
  @IsNotEmpty()
  @IsString()
  readonly LastName: string;

  @ApiProperty({ required: true, description: 'Salary' })
  @IsNotEmpty()
  @IsInt()
  readonly Salary: number;

  @ApiProperty({ required: true, description: 'Age' })
  @IsNotEmpty()
  @IsInt()
  readonly Age: number;
}
