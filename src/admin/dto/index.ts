import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createBloggerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'akashichris@gmail.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'akashi christian' })
  fullNames: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'akashi' })
  password: string;
}
