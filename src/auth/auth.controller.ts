import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { createAdminDto, userLoginDto } from './dto';

@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('create-admin')
  @ApiCreatedResponse({ description: 'Admin created OK' })
  @ApiBody({ type: createAdminDto })
  createAdmin(@Body() dto: createAdminDto) {
    return this.authService.createAdmin(dto);
  }

  @Post('user-login')
  @ApiCreatedResponse({ description: 'User Logged In' })
  @ApiForbiddenResponse({ description: 'Wrong password' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: userLoginDto })
  userLogin(@Body() dto: userLoginDto) {
    return this.authService.userLogin(dto);
  }
}
