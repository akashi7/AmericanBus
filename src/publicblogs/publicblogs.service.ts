import { Injectable } from '@nestjs/common';
import { Blog } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublicblogsService {
  constructor(private readonly prisma: PrismaService) {}
  async viewAllBlogs(): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany();
    return blogs;
  }
}
