import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DtoLogin, DtoRegister, IVerifyToken, Tokens } from './dto/dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    readonly prisma: PrismaService,
    readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: DtoRegister) {
    const candidate = await this.userService.getUserForEmail(dto.email);

    if (candidate) {
      throw new HttpException(
        'Пользователь уже существует',
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash: string = bcrypt.hashSync(dto.password, 10);

    const data: DtoRegister = {
      ...dto,
      password: passwordHash,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...otherUser } = await this.userService.createUser(data);
    const tokens = this.getTokens(otherUser.id);

    return { ...otherUser, tokens };
  }

  async login(dto: DtoLogin) {
    const candidate = await this.userService.getUserForEmail(dto.email);

    if (!candidate) {
      throw new HttpException(
        'Неверная почта или пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordHash: boolean = bcrypt.compareSync(
      dto.password,
      candidate.password,
    );

    if (!passwordHash) {
      throw new HttpException(
        'Неверная почта или пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...otherUser } = candidate;

    const tokens = this.getTokens(otherUser.id);

    return { ...otherUser, tokens };
  }

  async refresh(refresh_token: string) {
    const candidate = await this.verifeToken(refresh_token);

    if (!candidate) {
      throw new HttpException(
        'Ошибка при верификации токена',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.getUserForId(candidate.id);

    if (!user) {
      throw new HttpException('Поль-ль не найден', HttpStatus.NOT_FOUND);
    }

    const tokens = this.getTokens(user.id);

    return tokens;
  }

  async me(access_token: string) {
    const candidate = await this.verifeToken(access_token);

    if (!candidate) {
      throw new HttpException(
        'Ошибка при верификации токена',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.getUserForId(candidate.id);
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return safeUser;
  }

  getTokens(id: string): Tokens {
    const pyaload = {
      id: id,
    };

    const access_token = this.jwtService.sign(pyaload, {
      expiresIn: '1d',
    });

    const refresh_token = this.jwtService.sign(pyaload, {
      expiresIn: '30d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async verifeToken(token: string): Promise<IVerifyToken | null> {
    try {
      const user: IVerifyToken = await this.jwtService.verifyAsync(token);
      return user;
    } catch (error) {
      return null;
    }
  }
}
