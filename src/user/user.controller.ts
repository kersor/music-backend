import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'generated/prisma/client';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Обновить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID пользователя' },
        name: { type: 'string', description: 'Имя пользователя' },
        email: { type: 'string', description: 'Email пользователя' },
        password: { type: 'string', description: 'Пароль пользователя' },
        createdAt: { type: 'string', format: 'date-time', description: 'Дата создания' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Дата обновления' },
      },
    },
  })
  @ApiOkResponse({ description: 'Пользователь успешно обновлён' })
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: User) {
    return this.userService.updateUser(id, dto);
  }
}
