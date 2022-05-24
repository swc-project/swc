"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppController = void 0;
var _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
var _ts_param = require("@swc/helpers/lib/_ts_param.js").default;
var _common = require("@nestjs/common");
var _appService = require("./app.service");
var _createUserDto = require("./dtos/CreateUserDto");
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
exports.AppController = AppController;
_ts_decorate([
    (0, _common).Get(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], AppController.prototype, "getHello", null);
_ts_decorate([
    (0, _common).Post(),
    _ts_param(0, (0, _common).Body()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createUserDto.CreateUserDto === "undefined" ? Object : _createUserDto.CreateUserDto
    ])
], AppController.prototype, "create", null);
exports.AppController = AppController = _ts_decorate([
    (0, _common).Controller(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _appService.AppService === "undefined" ? Object : _appService.AppService
    ])
], AppController);
