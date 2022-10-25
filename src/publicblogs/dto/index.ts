import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class contactUsDto {
  @IsString()
  @ApiProperty({ type: String, required: false, default: 'akashi christian' })
  fullNames: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'akashichris7@gmail.com',
  })
  email: string;
  @IsString()
  @ApiProperty({ type: String, required: false, default: '078880000' })
  phone: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'greetings' })
  subject: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'Hello just wanted to great you',
  })
  message: string;
}
