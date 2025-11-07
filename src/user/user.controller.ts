import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'generated/prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: User) {
    return this.userService.updateUser(id, dto);
  }
}
