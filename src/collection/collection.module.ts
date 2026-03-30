import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, PrismaService],
  imports: [AuthModule],
})
export class CollectionModule {}
