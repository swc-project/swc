"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppController = void 0;
var swcHelpers = require("@swc/helpers");
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
swcHelpers.__decorate([
    (0, _common).Get(),
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [])
], AppController.prototype, "getHello", null);
swcHelpers.__decorate([
    (0, _common).Post(),
    function(target, key) {
        return (0, _common).Body()(target, key, 0);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof _createUserDto.CreateUserDto === "undefined" ? Object : _createUserDto.CreateUserDto
    ])
], AppController.prototype, "create", null);
exports.AppController = AppController = swcHelpers.__decorate([
    (0, _common).Controller(),
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof _appService.AppService === "undefined" ? Object : _appService.AppService
    ])
], AppController);
