import {
    Controller,
    Post,
    UseGuards,
    Body,
    Put,
    Param,
    ForbiddenException,
    UseInterceptors,
} from '@nestjs/common';

import {
    USER_CONTROLLER_ROUTE,
    USER_CREATE_ENDPOINT,
    USER_UPDATE_ENDPOINT,
} from '@server/constants/controllers';
import { CreateUserDto } from '@server/user/dto/CreateUserDto';
import { UpdateUserDto } from '@server/user/dto/UpdateUserDto';
import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import { User } from '@server/decorators/UserDecorator';
import { User as UserType } from '@server/user/schemas/UserSchema';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { UserService } from '@server/user/UserService';

@Controller(USER_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(UserType))
export class UserController {
    constructor(private userService: UserService) { }

    @Post(USER_CREATE_ENDPOINT)
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(USER_UPDATE_ENDPOINT)
    async update(
        @Param('id') userId: string,
        @Body() updateUserDto: UpdateUserDto,
        @User() user: UserType,
    ) {
        if (user.id !== userId) {
            throw new ForbiddenException();
        }

        return this.userService.update(userId, updateUserDto);
    }
}
