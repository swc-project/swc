"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppController", {
    enumerable: true,
    get: ()=>AppController
});
const _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
const _ts_param = require("@swc/helpers/lib/_ts_param.js").default;
const _common = require("@nestjs/common");
const _appservice = require("./app.service");
const _CreateUserDto = require("./dtos/CreateUserDto");
let AppController = class AppController {
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
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], AppController.prototype, "getHello", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _CreateUserDto.CreateUserDto === "undefined" ? Object : _CreateUserDto.CreateUserDto
    ])
], AppController.prototype, "create", null);
AppController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _appservice.AppService === "undefined" ? Object : _appservice.AppService
    ])
], AppController);
