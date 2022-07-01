"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppController", {
    enumerable: true,
    get: ()=>AppController
});
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const _tsMetadata = require("@swc/helpers/lib/_ts_metadata.js").default;
const _tsParam = require("@swc/helpers/lib/_ts_param.js").default;
const _common = require("@nestjs/common");
const _appService = require("./app.service");
const _createUserDto = require("./dtos/CreateUserDto");
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
_tsDecorate([
    (0, _common.Get)(),
    _tsMetadata("design:type", Function),
    _tsMetadata("design:paramtypes", [])
], AppController.prototype, "getHello", null);
_tsDecorate([
    (0, _common.Post)(),
    _tsParam(0, (0, _common.Body)()),
    _tsMetadata("design:type", Function),
    _tsMetadata("design:paramtypes", [
        typeof _createUserDto.CreateUserDto === "undefined" ? Object : _createUserDto.CreateUserDto
    ])
], AppController.prototype, "create", null);
AppController = _tsDecorate([
    (0, _common.Controller)(),
    _tsMetadata("design:type", Function),
    _tsMetadata("design:paramtypes", [
        typeof _appService.AppService === "undefined" ? Object : _appService.AppService
    ])
], AppController);
