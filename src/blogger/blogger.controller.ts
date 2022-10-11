import {
  Body,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiRequestTimeoutResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { BloggerService } from './blogger.service';
import { UploadFileDto } from './dto';

@Controller('blogger')
@ApiTags('blogger')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.BLOGGER)
@ApiUnauthorizedResponse({ description: 'Unthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class BloggerController {
  constructor(private readonly blogService: BloggerService) {}

  @AllowRoles(ERoles.BLOGGER, ERoles.ADMIN)
  @Post('uplaod')
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
    const result = await this.blogService.createBlog(file, dto, user);
    return new GenericResponse('Blog posted', result);
  }
}
