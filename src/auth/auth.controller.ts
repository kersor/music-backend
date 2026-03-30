import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { DtoLogin, DtoRegister, ResponceAuth } from './dto/dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() dto: DtoRegister,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponceAuth> {
    const { tokens, ...user } = await this.authService.register(dto);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      path: '/api/auth/refresh',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      ...user,
      access_token: tokens.access_token,
    };
  }

  @Post('/login')
  async login(
    @Body() dto: DtoLogin,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponceAuth> {
    const { tokens, ...user } = await this.authService.login(dto);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      path: '/api/auth/refresh',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      ...user,
      access_token: tokens.access_token,
    };
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = req.cookies as Record<string, string>;
    const refresh_token = cookies.refresh_token;

    const tokens = await this.authService.refresh(refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      path: '/api/auth/refresh',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      access_token: tokens.access_token,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Req() req: Request) {
    const cookies = req.cookies as Record<string, string>;
    const access_token = cookies.access_token;

    return this.authService.me(access_token);
  }
}
