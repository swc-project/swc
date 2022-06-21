"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppController", {
    get: ()=>AppController,
    enumerable: true
});
const _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js").default;
const _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js").default;
const _tsParamMjs = require("@swc/helpers/lib/_ts_param.js").default;
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
_tsDecorateMjs([
    (0, _common.Get)(),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [])
], AppController.prototype, "getHello", null);
_tsDecorateMjs([
    (0, _common.Post)(),
    _tsParamMjs(0, (0, _common.Body)()),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        typeof _createUserDto.CreateUserDto === "undefined" ? Object : _createUserDto.CreateUserDto
    ])
], AppController.prototype, "create", null);
AppController = _tsDecorateMjs([
    (0, _common.Controller)(),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        typeof _appService.AppService === "undefined" ? Object : _appService.AppService
    ])
], AppController);
