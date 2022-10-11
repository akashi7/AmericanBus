import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Blog, User } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadFileDto } from './dto';

@Injectable()
export class BloggerService {
  constructor(
    private readonly cloudinary: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}
  async createBlog(
    file: Express.Multer.File,
    dto: UploadFileDto,
    user: User,
  ): Promise<Blog> {
    const image = await this.cloudinary.uploadImage(file);
    if (image) {
      const blog = await this.prisma.blog.create({
        data: {
          title: dto.title,
          description: dto.description,
          userId: user.id,
          photoUrl: image.secure_url,
        },
      });
      return blog;
    }
    throw new RequestTimeoutException('Internet Error in uploading file');
  }
}
