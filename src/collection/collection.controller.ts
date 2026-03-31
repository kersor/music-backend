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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Коллекции')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать коллекцию' })
  @ApiOkResponse({ description: 'Коллекция создана' })
  @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
  @Post('/create')
  async createCollection(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.collectionService.createCollection(token);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить мои коллекции' })
  @ApiOkResponse({ description: 'Список коллекций пользователя' })
  @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
  @Get()
  async getMyPlaylists(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.collectionService.getMyPlaylists(token);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить коллекцию по ID' })
  @ApiParam({ name: 'id', description: 'ID коллекции' })
  @ApiOkResponse({ description: 'Коллекция найдена' })
  @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
  @Get(':id')
  async getMyPlaylist(@Param('id') id: string) {
    return this.collectionService.getMyPlaylist(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить коллекцию по ID' })
  @ApiParam({ name: 'id', description: 'ID коллекции' })
  @ApiBody({ type: DtoUpdateCollection })
  @ApiOkResponse({ description: 'Коллекция обновлена' })
  @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
  @Patch(':id')
  async updateCollection(
    @Param('id') id: string,
    @Body() dto: DtoUpdateCollection,
  ) {
    return this.collectionService.updateCollection(id, dto);
  }
}
