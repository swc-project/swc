let C = class _class {
    foo() {
        return new C();
    }
};
let x = (new C).foo();
