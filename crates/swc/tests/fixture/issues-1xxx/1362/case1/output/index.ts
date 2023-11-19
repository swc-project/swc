"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppController", {
    enumerable: true,
    get: function() {
        return AppController;
    }
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const _ts_metadata = require("@swc/helpers/_/_ts_metadata");
const _ts_param = require("@swc/helpers/_/_ts_param");
const _common = require("@nestjs/common");
const _appservice = require("./app.service");
const _CreateUserDto = require("./dtos/CreateUserDto");
class AppController {
    async getHello() {
        const result = await this.appService.getHello();
        return result;
    }
    async create(createUserDto) {
        console.log("createUserDto", createUserDto);
        return "Hello User!";
    }
    constructor(appService){
        this.appService = appService;
    }
}
_ts_decorate._([
    (0, _common.Get)(),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", []),
    _ts_metadata._("design:returntype", Promise)
], AppController.prototype, "getHello", null);
_ts_decorate._([
    (0, _common.Post)(),
    _ts_param._(0, (0, _common.Body)()),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        typeof _CreateUserDto.CreateUserDto === "undefined" ? Object : _CreateUserDto.CreateUserDto
    ]),
    _ts_metadata._("design:returntype", Promise)
], AppController.prototype, "create", null);
AppController = _ts_decorate._([
    (0, _common.Controller)(),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        typeof _appservice.AppService === "undefined" ? Object : _appservice.AppService
    ])
], AppController);
