class A {
    field = class {
        constructor(value = arguments) {
            arguments;
            () => arguments;
        }
    };
    static field = class {
        constructor(value = arguments) { arguments; }
    };
    static {
        class B {
            constructor(value = arguments) { arguments; }
        }
    }
}
