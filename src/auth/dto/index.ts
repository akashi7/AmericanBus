import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'christiannseko@gmail.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'christian' })
  fullNames: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'akashi' })
  password: string;
}

export class userLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'christiannseko@gmail.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'akashi' })
  password: string;
}
