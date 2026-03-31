import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { DtoCreateMusic } from './dto/dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Музыка')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить трек' })
  @ApiBody({ type: DtoCreateMusic })
  @ApiCreatedResponse({ description: 'Трек успешно создан' })
  @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
  @Post()
  async createMusic(@Body() dto: DtoCreateMusic, @Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';

    return this.musicService.createMusic(dto, token);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить мои треки' })
  @ApiOkResponse({ description: 'Список треков текущего пользователя' })
  @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
  @Get('/me')
  async getMyMusic(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';

    return this.musicService.getMyMusic(token);
  }

  @ApiOperation({ summary: 'Получить все треки' })
  @ApiOkResponse({ description: 'Список всех треков' })
  @Get()
  async getAllMusic() {
    return this.musicService.getAllMusic();
  }
}
