class Service {
    async is(a: string): Promise<boolean> {
        return a.toUpperCase() === a;
    }
}
(async () => { await (new Service()).is('ABC'); })();