import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
export var UsersModule = function UsersModule() {
    "use strict";
    _class_call_check(this, UsersModule);
};
UsersModule = _ts_decorate([
    Module({
        controllers: [
            UsersController
        ],
        providers: [
            UsersService
        ]
    })
], UsersModule);
