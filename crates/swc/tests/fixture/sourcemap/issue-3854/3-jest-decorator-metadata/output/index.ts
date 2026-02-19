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
const _define_property = require("@swc/helpers/_/_define_property");
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const _ts_metadata = require("@swc/helpers/_/_ts_metadata");
const _ts_param = require("@swc/helpers/_/_ts_param");
const _common = require("@nestjs/common");
const _appservice = require("./app.service");
class AppController {
    constructor(appService){
        _define_property._(this, "appService", void 0);
        this.appService = appService;
    }
}
AppController = _ts_decorate._([
    _ts_param._(0, (0, _common.Inject)(_appservice.AppService)),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        /*istanbul ignore next*/ typeof _appservice.AppService === "undefined" ? Object : _appservice.AppService
    ])
], AppController);
