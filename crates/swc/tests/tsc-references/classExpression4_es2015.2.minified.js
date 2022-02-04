let C = class {
    foo() {
        return new C();
    }
};
(new C).foo();
