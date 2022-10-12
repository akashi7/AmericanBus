import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
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
}
