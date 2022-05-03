var _class, _descriptor, _dec, _dec1, _descriptor1, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11;
import { AppService } from './app.service';
import { Session, Res } from '@nestjs/common';
import * as express from 'express';
var _dec12 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof AppService === "undefined" ? Object : AppService
]), _dec13 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec14 = Controller();
export let AppController = _class = _dec14(_class = _dec13(_class = _dec12(((_class = class AppController {
    constructor(private appService: AppService){
        _initializerDefineProperty(this, "appService", _descriptor, this);
        _initializerDefineProperty(this, "appService2", _descriptor1, this);
    }
    getHello(): string {
        return this.appService.getHello();
    }
    async callback(res: express.Response, session: express.Express.Session) {
        const token = await this.getToken(code);
        const user = await this.getUserInfo(token.access_token);
        session.oauth2Token = token;
        session.user = user;
        return res.redirect(state.returnUrl ?? '/');
    }
}) || _class, _dec = Inject(), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof AppService === "undefined" ? Object : AppService), _dec2 = Inject(), _dec3 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof AppService === "undefined" ? Object : AppService), _descriptor = _applyDecoratedDescriptor(_class.prototype, "appService", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, "appService2", [
    _dec2,
    _dec3
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _dec4 = Get(), _dec5 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec6 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", []), _applyDecoratedDescriptor(_class.prototype, "getHello", [
    _dec4,
    _dec5,
    _dec6
], Object.getOwnPropertyDescriptor(_class.prototype, "getHello"), _class.prototype), _dec7 = Get('/callback'), _dec8 = function(target, key) {
    return Res()(target, key, 0);
}, _dec9 = function(target, key) {
    return Session()(target, key, 1);
}, _dec10 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec11 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof express === "undefined" || typeof express.Response === "undefined" ? Object : express.Response,
    typeof express === "undefined" || typeof express.Express === "undefined" || typeof express.Express.Session === "undefined" ? Object : express.Express.Session
]), _applyDecoratedDescriptor(_class.prototype, "callback", [
    _dec7,
    _dec8,
    _dec9,
    _dec10,
    _dec11
], Object.getOwnPropertyDescriptor(_class.prototype, "callback"), _class.prototype), _class)) || _class) || _class) || _class;
