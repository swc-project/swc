"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    AppController: function() {
        return AppController;
    }
});
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js");
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js");
var _tsParamMjs = require("@swc/helpers/lib/_ts_param.js");
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
(0, _tsDecorateMjs.default)([
    (0, _common.Get)(),
    (0, _tsMetadataMjs.default)("design:type", Function),
    (0, _tsMetadataMjs.default)("design:paramtypes", [])
], AppController.prototype, "getHello", null);
(0, _tsDecorateMjs.default)([
    (0, _common.Post)(),
    (0, _tsParamMjs.default)(0, (0, _common.Body)()),
    (0, _tsMetadataMjs.default)("design:type", Function),
    (0, _tsMetadataMjs.default)("design:paramtypes", [
        typeof _createUserDto.CreateUserDto === "undefined" ? Object : _createUserDto.CreateUserDto
    ])
], AppController.prototype, "create", null);
AppController = (0, _tsDecorateMjs.default)([
    (0, _common.Controller)(),
    (0, _tsMetadataMjs.default)("design:type", Function),
    (0, _tsMetadataMjs.default)("design:paramtypes", [
        typeof _appService.AppService === "undefined" ? Object : _appService.AppService
    ])
], AppController);
