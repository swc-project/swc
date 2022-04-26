"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppController = void 0;
var swcHelpers = require("@swc/helpers");
var _common = require("@nestjs/common");
var _appService = require("./app.service");
var _createUserDto = require("./dtos/CreateUserDto");
var _class, _dec, _dec1, _dec2, _dec3, _dec4, _dec5, _dec6;
var _dec7 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof _appService.AppService === "undefined" ? Object : _appService.AppService
]), _dec8 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec9 = (0, _common).Controller();
let AppController = _class = _dec9(_class = _dec8(_class = _dec7(((_class = class AppController {
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
}) || _class, _dec = (0, _common).Get(), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec2 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", []), swcHelpers.applyDecoratedDescriptor(_class.prototype, "getHello", [
    _dec,
    _dec1,
    _dec2
], Object.getOwnPropertyDescriptor(_class.prototype, "getHello"), _class.prototype), _dec3 = (0, _common).Post(), _dec4 = function(target, key) {
    return (0, _common).Body()(target, key, 0);
}, _dec5 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec6 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof _createUserDto.CreateUserDto === "undefined" ? Object : _createUserDto.CreateUserDto
]), swcHelpers.applyDecoratedDescriptor(_class.prototype, "create", [
    _dec3,
    _dec4,
    _dec5,
    _dec6
], Object.getOwnPropertyDescriptor(_class.prototype, "create"), _class.prototype), _class)) || _class) || _class) || _class;
exports.AppController = AppController;
