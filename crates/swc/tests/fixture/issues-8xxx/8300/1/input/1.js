class Foo extends Bar {
    constructor() {
        super();
        for (const i of [1]) {
            test(() => {
                this.i = i
            })
        }
    }
}

function test(f) {
    f()
}