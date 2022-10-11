import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditProfileDto {
  @IsString()
  @ApiProperty({ type: String, required: false })
  email: string;
  @IsString()
  @ApiProperty({ type: String, required: false })
  fullNames: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  password: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  confirmPassword: string;
}

export class UpdateBlogDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: false })
  title: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: false })
  description: string;
}
