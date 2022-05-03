import { AppService } from './app.service';
import { Session, Res } from '@nestjs/common';
import * as express from 'express';
export let AppController = class AppController {
    constructor(private appService: AppService){}
    appService: AppService;
    private appService2: AppService;
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
};
__decorate([
    Inject(),
    __metadata("design:type", typeof AppService === "undefined" ? Object : AppService)
], AppController.prototype, "appService", void 0);
__decorate([
    Inject(),
    __metadata("design:type", typeof AppService === "undefined" ? Object : AppService)
], AppController.prototype, "appService2", void 0);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [])
], AppController.prototype, "getHello", null);
__decorate([
    Get('/callback'),
    __param(0, Res()),
    __param(1, Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof express === "undefined" || typeof express.Response === "undefined" ? Object : express.Response,
        typeof express === "undefined" || typeof express.Express === "undefined" || typeof express.Express.Session === "undefined" ? Object : express.Express.Session
    ])
], AppController.prototype, "callback", null);
AppController = __decorate([
    Controller(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof AppService === "undefined" ? Object : AppService
    ])
], AppController);
