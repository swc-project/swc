import { AppService } from './app.service';

import { Session, Res } from '@nestjs/common';
import * as express from 'express';

@Controller()
export class AppController {
    constructor(private appService: AppService) { }

    @Inject()
    appService: AppService;

    @Inject()
    private appService2: AppService;

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/callback')
    async callback(@Res() res: express.Response, @Session() session: express.Express.Session) {
        const token = await this.getToken(code)
        const user = await this.getUserInfo(token.access_token)

        session.oauth2Token = token
        session.user = user
        return res.redirect(state.returnUrl ?? '/')
    }
}