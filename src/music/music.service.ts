import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DtoCreateMusic } from './dto/dto';
import { join } from 'path';
import { promises as fs } from 'fs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MusicService {
  private readonly musicDir = join(process.cwd(), 'uploads', 'files', 'music');
  constructor(
    private readonly prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createMusic(dto: DtoCreateMusic, token: string) {
    const payload = await this.authService.verifeToken(token);
    if (!payload) return;

    const userId = payload.id;
    const filePath = join(this.musicDir, dto.filename);

    try {
      await fs.access(filePath);

      const music = await this.prisma.music.create({
        data: {
          name: dto.name,
          filename: dto.filename,
          image: dto.image,
          duration: String(dto.duration),
          authorId: userId,
        },
      });

      return { music };
    } catch {
      return { musicExists: false };
    }
  }

  async getMyMusic(token: string) {
    const payload = await this.authService.verifeToken(token);
    if (!payload) return;

    const userId = payload.id;

    const musics = await this.prisma.music.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return musics;
  }

  async getAllMusic() {
    const musics = await this.prisma.music.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return musics;
  }
}
