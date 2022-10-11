import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { createBloggerDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createBlogger(dto: createBloggerDto): Promise<User> {
    const blogger = await this.prisma.blogger.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (blogger) throw new ConflictException('Blogger exists');
    const newBlogger = await this.prisma.blogger.create({
      data: {
        email: dto.email,
        fullNames: dto.fullNames,
      },
    });
    if (newBlogger) {
      const password = await argon.hash(dto.password);
      const user = await this.prisma.user.findFirst({
        where: {
          email: newBlogger.email,
        },
      });
      if (user) throw new ConflictException('User arleady exist');
      const newUser = await this.prisma.user.create({
        data: {
          email: newBlogger.email,
          fullNames: newBlogger.fullNames,
          password,
          userId: newBlogger.id,
          role: ERoles.BLOGGER,
        },
      });
      return newUser;
    }
  }
}
