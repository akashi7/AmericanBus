import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { BloggerModule } from './blogger/blogger.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [AdminModule, 
    BloggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  
})
export class AppModule {}
