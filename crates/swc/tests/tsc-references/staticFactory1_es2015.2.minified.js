class Base {
    foo() {
        return 1;
    }
    static create() {
        return new this();
    }
}
(class extends Base {
    foo() {
        return 2;
    }
}).create().foo();
