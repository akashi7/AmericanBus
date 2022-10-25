import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { BloggerModule } from './blogger/blogger.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './__shared__/filters/global-exception.filter';
import { UserModule } from './user/user.module';
import { PublicblogsModule } from './publicblogs/publicblogs.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AdminModule,
    BloggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
    UserModule,
    PublicblogsModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
