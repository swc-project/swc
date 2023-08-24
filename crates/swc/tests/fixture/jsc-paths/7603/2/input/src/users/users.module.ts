import { Module } from '@nestjs/common';
import { UsersService } from 'users/users.service.js';
import { UsersController } from 'users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
