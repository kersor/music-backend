import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { DtoUpdateCollection } from './dto/dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async createCollection(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.collectionService.createCollection(token);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getMyPlaylists(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.collectionService.getMyPlaylists(token);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getMyPlaylist(@Param('id') id: string) {
    return this.collectionService.getMyPlaylist(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateCollection(
    @Param('id') id: string,
    @Body() dto: DtoUpdateCollection,
  ) {
    return this.collectionService.updateCollection(id, dto);
  }
}
