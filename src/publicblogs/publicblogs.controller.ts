import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { contactUsDto } from './dto';
import { PublicblogsService } from './publicblogs.service';

@Controller('publicblogs')
@ApiTags('publicblogs')
@ApiInternalServerErrorResponse({ description: 'Server Error' })
export class PublicblogsController {
  constructor(private readonly publiService: PublicblogsService) {}

  @Get('view-blogs')
  @ApiOkResponse({ description: 'all blogs return' })
  @ApiOperation({ summary: 'List of all blogs' })
  async viewBlogs() {
    const result = await this.publiService.viewAllBlogs();
    return new GenericResponse('all blogs ', result);
  }
  @Get('view-one-blog')
  @ApiOkResponse({ description: 'one blog return' })
  @ApiQuery({ name: 'id', required: true, description: 'Blog id' })
  @ApiOperation({ summary: 'View one blog' })
  async viewOneBlog(@Query('id', ParseIntPipe) id: number) {
    const result = await this.publiService.viewBlog(id);
    return new GenericResponse('one blog', result);
  }

  @ApiCreatedResponse({ description: 'Email sent' })
  @ApiBadGatewayResponse({ description: 'Email not sent' })
  @ApiOperation({ summary: 'contact us form' })
  @ApiBody({ type: contactUsDto })
  @Post('contact-us')
  async contactUsForm(@Body() dto: contactUsDto) {
    const result = await this.publiService.contactUs(dto);
    return new GenericResponse('mail status', result);
  }
}
