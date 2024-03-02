import { AppService } from "./app.service";
import { Session, Res } from "@nestjs/common";
import * as express from "express";
export class AppController {
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
        return res.redirect(state.returnUrl ?? "/");
    }
}
_ts_decorate([
    Inject(),
    _ts_metadata("design:type", typeof AppService === "undefined" ? Object : AppService)
], AppController.prototype, "appService", void 0);
_ts_decorate([
    Inject(),
    _ts_metadata("design:type", typeof AppService === "undefined" ? Object : AppService)
], AppController.prototype, "appService2", void 0);
_ts_decorate([
    Get(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
_ts_decorate([
    Get("/callback"),
    _ts_param(0, Res()),
    _ts_param(1, Session()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof express === "undefined" || typeof express.Response === "undefined" ? Object : express.Response,
        typeof express === "undefined" || typeof express.Express === "undefined" || typeof express.Express.Session === "undefined" ? Object : express.Express.Session
    ]),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "callback", null);
AppController = _ts_decorate([
    Controller(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AppService === "undefined" ? Object : AppService
    ])
], AppController);
