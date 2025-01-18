import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
} from 'class-validator';

export class PostJobDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  requirements: string[];

  @IsNumber()
  @IsNotEmpty()
  salary: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  jobType: string;

  @IsString()
  @IsNotEmpty()
  experienceLevel: string;

  @IsNumber()
  @IsNotEmpty()
  positions: number;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
