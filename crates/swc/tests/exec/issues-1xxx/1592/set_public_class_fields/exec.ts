class LoggerService {
    debug(message: string): void {
        console.log({ message });
    }
}

export function Logger(): any {
    return (target: Record<string, any>, key: string | symbol): void => {
        const loggerService: LoggerService = new LoggerService();
        const updated: boolean = Reflect.defineProperty(target, key, {
            configurable: false,
            enumerable: true,
            value: loggerService,
            writable: false,
        });

        if (!updated) {
            throw new Error(`Unable to define ${String(key)} property for ${JSON.stringify(target)}`);
        }
    };
}

class TestClass1 {
    @Logger() private readonly logger: LoggerService;

    test(): void {
        this.logger.debug('test1');
    }
}

class TestClass2 {
    @Logger() private readonly logger: LoggerService;

    test(): void {
        this.logger.debug('test2');
    }
}

(async (): Promise<void> => {
    new TestClass1().test();
    new TestClass2().test();
    console.log('OK');
})();