import { ApiProperty } from '@nestjs/swagger';

export class DtoRegister {
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  name: string;

  @ApiProperty({ example: 'ivan@mail.ru', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Пароль пользователя' })
  password: string;
}

export class DtoLogin {
  @ApiProperty({ example: 'ivan@mail.ru', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Пароль пользователя' })
  password: string;
}

export class Tokens {
  @ApiProperty({ description: 'JWT access-токен' })
  access_token: string;

  @ApiProperty({ description: 'JWT refresh-токен' })
  refresh_token: string;
}

export class ResponceAuth {
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  name: string;

  @ApiProperty({ example: 'ivan@mail.ru', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ description: 'JWT access-токен' })
  access_token: string;

  @ApiProperty({ description: 'Дата создания аккаунта' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления аккаунта' })
  updatedAt: Date;
}

export class IVerifyToken {
  id: string;
  iat: number;
  exp: number;
}
