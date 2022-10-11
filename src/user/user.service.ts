import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Blog, User } from '@prisma/client';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { UploadFileDto } from 'src/blogger/dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditProfileDto, UpdateBlogDto, UpdatePasswordDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async update(
    role: string,
    id: number,
    obj: EditProfileDto,
    user: User,
  ): Promise<string> {
    let message: string;
    await this.prisma[`${role}`]['update']({
      data: {
        email: obj.email,
        fullNames: obj.fullNames,
      },
      where: {
        id,
      },
    });

    const userFound = await this.prisma.user.findFirst({
      where: { email: obj.email },
    });

    if (userFound) {
      throw new ConflictException('Email arleady exists');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: obj.email,
        fullNames: obj.fullNames,
      },
    });
    message = 'User info updated';
    return message;
  }

  async userEditeProfile(dto: EditProfileDto, user: User): Promise<string> {
    const userFound = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (userFound.role === ERoles.ADMIN) {
      return this.update('admin', userFound.userId, dto, user);
    }
    return this.update('blogger', userFound.userId, dto, user);
  }

  async userEditPassword(dto: UpdatePasswordDto, user: User): Promise<string> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException("Password's do not match");
    }
    const userFound = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!(await argon.verify(userFound.password, dto.password))) {
      throw new ForbiddenException('Wrong password');
    }
    const password = await argon.hash(dto.password);
    const i = await this.prisma.user.update({
      where: {
        id: userFound.id,
      },
      data: {
        password,
      },
    });
    if (i) {
      const message = 'password updated';
      return message;
    }
  }

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

  async userViewAllHisBlogs(user: User): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany({
      where: {
        userId: user.id,
      },
    });
    return blogs;
  }

  async viewBlog(id: number): Promise<Blog> {
    const blog = await this.prisma.blog.findFirst({
      where: { id },
    });
    return blog;
  }

  async updateBlog(
    dto: UpdateBlogDto,
    id: number,
    user: User,
  ): Promise<string> {
    const blog = await this.prisma.blog.findFirst({
      where: {
        AND: [{ id }, { userId: user.id }],
      },
    });

    if (!blog) throw new ForbiddenException("Can't update blog");

    const t = await this.prisma.blog.update({
      data: {
        title: dto.title,
        description: dto.description,
      },
      where: {
        id,
      },
    });
    if (t) {
      const message = 'blog updated';
      return message;
    }
  }

  async deleteBlog(id: number, user: User): Promise<string> {
    const blog = await this.prisma.blog.findFirst({
      where: {
        AND: [{ id }, { userId: user.id }],
      },
    });
    if (!blog) throw new ForbiddenException("can't delete blog");
    const k = await this.prisma.blog.delete({
      where: {
        id,
      },
    });
    if (k) {
      const message = 'deleted blog';
      return message;
    }
  }
}
