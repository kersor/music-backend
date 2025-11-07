import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MusicController],
  providers: [MusicService, PrismaService],
  imports: [AuthModule],
})
export class MusicModule {}
