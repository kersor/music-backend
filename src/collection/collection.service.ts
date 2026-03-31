import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { DtoUpdateCollection } from './dto/dto';

@Injectable()
export class CollectionService {
  constructor(
    private readonly prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createCollection(token: string) {
    const payload = await this.authService.verifeToken(token);
    if (!payload) return;

    const collectionNew = await this.prisma.collection.create({
      data: {
        authorId: payload.id,
        name: 'Новый плейлист',
      },
    });

    return collectionNew;
  }

  async getMyPlaylists(token: string) {
    const payload = await this.authService.verifeToken(token);
    if (!payload) return;

    const collections = await this.prisma.collection.findMany({
      where: {
        authorId: payload.id,
      },
    });

    return collections;
  }

  async getMyPlaylist(id: string) {
    const collection = await this.prisma.collection.findFirst({
      where: {
        id: id,
      },
    });

    return collection;
  }

  async updateCollection(id: string, dto: DtoUpdateCollection) {
    const updateCollection = await this.prisma.collection.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });

    return updateCollection;
  }

  async getAllMusicInCollection(collection_id: string) {
    const musics = await this.prisma.musicCollection.findMany({
      where: {
        collectionId: collection_id,
      },
      include: {
        music: {
          include: {
            author: true,
          },
        },
      },
    });

    return musics;
  }

  async addMusicInCollection(collectionId: string, musicId: string) {
    const collection = await this.prisma.collection.findFirst({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      throw new HttpException('Не найдена коллекция', HttpStatus.BAD_REQUEST);
    }

    const music = await this.prisma.music.findFirst({
      where: {
        id: musicId,
      },
    });

    if (!music) {
      throw new HttpException('Не найдена музыка', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.musicCollection.create({
      data: {
        collectionId: collectionId,
        musicId: musicId,
      },
      include: {
        music: {
          include: {
            author: true,
            collections: true,
          },
        },
      },
    });
  }
}
