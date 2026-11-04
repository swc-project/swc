class Base {
    constructor() {
        this.Foo = class {
            static {
                this.foo = new.target;
            }
        };
    }
}
