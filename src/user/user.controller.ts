import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiRequestTimeoutResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { UploadFileDto } from 'src/blogger/dto';
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

  @Post('create-blog')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Blog uploaded' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', default: 'Services' },
        description: {
          type: 'integer',
          default: 'Our services are great and we provide all',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Create Blog by sending Title,photo and description',
  })
  @ApiRequestTimeoutResponse({ description: 'Internet Error' })
  @ApiBadRequestResponse({ description: 'Wrong file type' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp('^.*.(jpg|png|jpeg)$', 'i'),
        })
        .addMaxSizeValidator({
          maxSize: 1 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: 400,
        }),
    )
    file: Express.Multer.File,
    @Body() dto: UploadFileDto,
    @GetUser() user: User,
  ) {
    const result = await this.userService.createBlog(file, dto, user);
    return new GenericResponse('Blog posted', result);
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
