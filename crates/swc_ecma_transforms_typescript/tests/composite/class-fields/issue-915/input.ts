export class Logger {
    #level: LogLevels;
    #handlers: BaseHandler[];
    readonly #loggerName: string;

    constructor(
        loggerName: string,
        levelName: LevelName,
        options: LoggerOptions = {},
    ) {
        this.#loggerName = loggerName;
        this.#level = getLevelByName(levelName);
        this.#handlers = options.handlers || [];
    }
}
