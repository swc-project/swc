import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
export var AppModule = function AppModule() {
    "use strict";
    _class_call_check(this, AppModule);
};
AppModule = _ts_decorate([
    Module({
        imports: [],
        controllers: [
            AppController
        ],
        providers: [
            AppService
        ]
    })
], AppModule);
