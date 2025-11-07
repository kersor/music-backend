import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { DtoRegister } from 'src/auth/dto/dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService) {}

  async getUserForEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  async getUserForId(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    return user;
  }

  async createUser(dto: DtoRegister) {
    const user = await this.prisma.user.create({
      data: dto,
    });

    return user;
  }

  async updateUser(id: string, dto: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.prisma.user.update({
      where: { id: id },
      data: { ...dto },
    });

    return user;
  }
}
