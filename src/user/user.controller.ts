import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { EditProfileDto, UpdateBlogDto, UpdatePasswordDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.ADMIN, ERoles.BLOGGER)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unthorized' })
@ApiInternalServerErrorResponse({ description: 'Server Error' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiConflictResponse({ description: 'Email arleady exists' })
  @HttpCode(200)
  @ApiOkResponse({ description: 'updated profile' })
  @ApiOperation({ summary: 'Edit user profile , email or Names' })
  @ApiBody({ type: EditProfileDto })
  @Patch('edit-profile')
  async userEditProfile(@Body() dto: EditProfileDto, @GetUser() user: User) {
    const result = await this.userService.userEditeProfile(dto, user);
    return new GenericResponse('update', result);
  }

  @HttpCode(200)
  @Patch('edit-password')
  @ApiOkResponse({ description: 'updated password' })
  @ApiOperation({ summary: 'Edit user passwords' })
  @ApiBody({ type: UpdatePasswordDto })
  async userEditPassword(
    @Body() dto: UpdatePasswordDto,
    @GetUser() user: User,
  ) {
    const result = await this.userService.userEditPassword(dto, user);
    return new GenericResponse('updated password', result);
  }

  @ApiOkResponse({ description: 'all blogs' })
  @Get('all-blogs')
  @ApiOperation({ summary: 'User view all his/her blogs ' })
  async userFindHisBlogs(@GetUser() user: User) {
    const result = await this.userService.userViewAllHisBlogs(user);
    return new GenericResponse('Blogs', result);
  }

  @ApiOkResponse({ description: 'one blog' })
  @ApiOperation({ summary: 'User view one blog ' })
  @ApiQuery({ name: 'id', required: true, description: 'Blog Id' })
  @Get('view-blog')
  async userViewBlog(@Query('id', ParseIntPipe) id: number) {
    const result = await this.userService.viewBlog(id);
    return new GenericResponse('One Blog', result);
  }

  @HttpCode(200)
  @ApiOkResponse({ description: 'updated blog' })
  @ApiOperation({ summary: 'User update blog ' })
  @ApiQuery({ name: 'id', required: true, description: 'blog Id' })
  @ApiForbiddenResponse({ description: "can't update Blog" })
  @Patch('update-blog')
  async userUpdateBlog(
    @Body() dto: UpdateBlogDto,
    @Query('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const result = await this.userService.updateBlog(dto, id, user);
    return new GenericResponse('blog updated', result);
  }

  @HttpCode(200)
  @ApiQuery({ name: 'id', required: true, description: 'blog Id' })
  @ApiOkResponse({ description: 'deleted blog' })
  @ApiForbiddenResponse({ description: "can't delete Blog" })
  @ApiOperation({ summary: 'User delete blog ' })
  @Delete('delete-blog')
  async deleteBlog(
    @Query('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const result = await this.userService.deleteBlog(id, user);
    return new GenericResponse('Deleted Blog', result);
  }
}
