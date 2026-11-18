function wrap() {
    // The computed key of a nested class uses the `new.target` of the static
    // initializer, which is `undefined`.
    class C {
        static set(x) {
            C.value = x;
        }
        static cache = console.log(
            Object.getOwnPropertyNames(
                class {
                    [String(new.target === undefined)]() {}
                }.prototype,
            ).join(),
        );
    }

    // The heritage expression of a nested class uses the same `new.target`.
    class D {
        static set(x) {
            D.value = x;
        }
        static cache = class extends (console.log(new.target === undefined), Object) {};
    }
}

new wrap();
