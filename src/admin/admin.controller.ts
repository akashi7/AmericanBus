import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowRoles } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { AdminService } from './admin.service';
import { createBloggerDto } from './dto';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.ADMIN)
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiCreatedResponse({ description: 'Blogger Created' })
  @ApiConflictResponse({ description: 'Blogger or user Exists' })
  @ApiBody({ type: createBloggerDto })
  @Post('create-blogger')
  async createBlogger(@Body() dto: createBloggerDto) {
    const result = await this.adminService.createBlogger(dto);
    return new GenericResponse('Blogger created', result);
  }
}
