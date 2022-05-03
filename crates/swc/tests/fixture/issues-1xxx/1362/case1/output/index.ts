"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var swcHelpers = require("@swc/helpers");
var _common = require("@nestjs/common");
var _appService = require("./app.service");
var _createUserDto = require("./dtos/CreateUserDto");
@(0, _common).Controller()
@typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function)
@typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof _appService.AppService === "undefined" ? Object : _appService.AppService
])
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
exports.AppController = AppController;
swcHelpers.__decorate([
    (0, _common).Get(),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [])
], AppController.prototype, "getHello", null);
swcHelpers.__decorate([
    (0, _common).Post(),
    function(target, key) {
        return (0, _common).Body()(target, key, 0);
    },
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof _createUserDto.CreateUserDto === "undefined" ? Object : _createUserDto.CreateUserDto
    ])
], AppController.prototype, "create", null);
