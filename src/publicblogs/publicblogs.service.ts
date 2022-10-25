import { Injectable } from '@nestjs/common';
import { Blog } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { contactUsDto } from './dto';

@Injectable()
export class PublicblogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}
  async viewAllBlogs(): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany();
    return blogs;
  }
  async viewBlog(id: number): Promise<Blog> {
    const blog = await this.prisma.blog.findFirst({
      where: { id },
    });
    return blog;
  }

  async contactUs(dto: contactUsDto): Promise<{ message: string }> {
    const { email, message, fullNames, phone, subject } = dto;
    return this.mail.sendMail(
      `info@americabuz.com`,
      `${subject}`,
      `${email}`,
      `
      ${fullNames ? `sender names are ${fullNames}` : ``} 
      ${phone ? `contact phone are ${phone}` : ''}

      ${message}
      `,
    );
  }
}
