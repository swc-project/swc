export class LoggerAdapter {
    constructor(logger){
        this.logger = logger, this._information = this.logger.information();
    }
}
