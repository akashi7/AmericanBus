import { Module } from '@nestjs/common';
import { PublicblogsService } from './publicblogs.service';
import { PublicblogsController } from './publicblogs.controller';

@Module({
  providers: [PublicblogsService],
  controllers: [PublicblogsController]
})
export class PublicblogsModule {}
