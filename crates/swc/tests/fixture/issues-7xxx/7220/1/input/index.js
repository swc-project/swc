const _BOUND_FUNCTIONS = {};

export class BackgroundJob {
}

class TestClass {
    calls = [];

    @BackgroundJob.bind
    success(s, n) {
        this.calls.push(`success(${s}, ${n})`);
        return Promise.resolve();
    }
}