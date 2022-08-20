import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import _ts_metadata from "@swc/helpers/src/_ts_metadata.mjs";
import _ts_param from "@swc/helpers/src/_ts_param.mjs";
import regeneratorRuntime from "regenerator-runtime";
import { Controller, Post, UseGuards, Body, Put, Param, ForbiddenException, UseInterceptors } from "@nestjs/common";
import { USER_CONTROLLER_ROUTE, USER_CREATE_ENDPOINT, USER_UPDATE_ENDPOINT } from "@server/constants/controllers";
import { CreateUserDto } from "@server/user/dto/CreateUserDto";
import { UpdateUserDto } from "@server/user/dto/UpdateUserDto";
import { JwtAuthGuard } from "@server/auth/guards/JwtAuthGuard";
import { User } from "@server/decorators/UserDecorator";
import { User as UserType } from "@server/user/schemas/UserSchema";
import { MongooseClassSerializerInterceptor } from "@server/interceptors/MongooseClassSerializerInterceptor";
import { UserService } from "@server/user/UserService";
export var UserController = /*#__PURE__*/ function() {
    "use strict";
    function UserController(userService) {
        _class_call_check(this, UserController);
        this.userService = userService;
    }
    var _proto = UserController.prototype;
    _proto.signup = function signup(createUserDto) {
        var _this = this;
        return _async_to_generator(/*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.abrupt("return", _this.userService.create(createUserDto));
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    _proto.update = function update(userId, updateUserDto, user) {
        var _this = this;
        return _async_to_generator(/*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        if (!(user.id !== userId)) {
                            _ctx.next = 2;
                            break;
                        }
                        throw new ForbiddenException();
                    case 2:
                        return _ctx.abrupt("return", _this.userService.update(userId, updateUserDto));
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return UserController;
}();
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
    _ts_param(0, Param("id")),
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
