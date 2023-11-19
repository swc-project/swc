class Foo extends Bar {
    constructor() {
        for (const i of [1]) {
            setTimeout(() => {
                this.i = i;
            });
        }
        super();
    }
}