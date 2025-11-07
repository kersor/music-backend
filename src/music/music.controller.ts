import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { DtoCreateMusic } from './dto/dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createMusic(@Body() dto: DtoCreateMusic, @Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';

    return this.musicService.createMusic(dto, token);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMyMusic(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';

    return this.musicService.getMyMusic(token);
  }

  @Get()
  async getAllMusic() {
    return this.musicService.getAllMusic();
  }
}
