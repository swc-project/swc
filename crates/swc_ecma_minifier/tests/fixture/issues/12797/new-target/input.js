function wrap() {
    // `new.target` in a static initializer is `undefined`, even when the
    // enclosing function is called with `new`.
    class C {
        static set(x) {
            C.value = x;
        }
        static cache = console.log(new.target === undefined);
    }

    class D {
        static set(x) {
            D.value = x;
        }
        static cache = console.log((() => new.target === undefined)());
    }
}

new wrap();
