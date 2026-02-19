import { Inject } from "@nestjs/common";
import { AppService } from "./app.service";

export class AppController {
    constructor(
        @Inject(AppService)
        private readonly appService: AppService
    ) {}
}
