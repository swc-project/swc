class Base {
    constructor() {
        this.Foo = class {
            static #_ = (() => {
                this.foo = new.target;
            })();
        };
    }
}
