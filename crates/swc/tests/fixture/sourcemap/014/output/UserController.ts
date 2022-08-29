import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import _ts_metadata from "@swc/helpers/src/_ts_metadata.mjs";
import _ts_param from "@swc/helpers/src/_ts_param.mjs";
import { Controller, Post, UseGuards, Body, Put, Param, ForbiddenException, UseInterceptors } from '@nestjs/common';
import { USER_CONTROLLER_ROUTE, USER_CREATE_ENDPOINT, USER_UPDATE_ENDPOINT } from '@server/constants/controllers';
import { CreateUserDto } from '@server/user/dto/CreateUserDto';
import { UpdateUserDto } from '@server/user/dto/UpdateUserDto';
import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import { User } from '@server/decorators/UserDecorator';
import { User as UserType } from '@server/user/schemas/UserSchema';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { UserService } from '@server/user/UserService';
export let UserController = class UserController {
    constructor(userService){
        this.userService = userService;
    }
    async signup(createUserDto) {
        return this.userService.create(createUserDto);
    }
    async update(userId, updateUserDto, user) {
        if (user.id !== userId) {
            throw new ForbiddenException();
        }
        return this.userService.update(userId, updateUserDto);
    }
};
_ts_decorate([
    Post(USER_CREATE_ENDPOINT),
    _ts_param(0, Body()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateUserDto === "undefined" ? Object : CreateUserDto
    ])
], UserController.prototype, "signup", null);
_ts_decorate([
    UseGuards(JwtAuthGuard),
    Put(USER_UPDATE_ENDPOINT),
    _ts_param(0, Param('id')),
    _ts_param(1, Body()),
    _ts_param(2, User()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof UpdateUserDto === "undefined" ? Object : UpdateUserDto,
        typeof UserType === "undefined" ? Object : UserType
    ])
], UserController.prototype, "update", null);
UserController = _ts_decorate([
    Controller(USER_CONTROLLER_ROUTE),
    UseInterceptors(MongooseClassSerializerInterceptor(UserType)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof UserService === "undefined" ? Object : UserService
    ])
], UserController);
