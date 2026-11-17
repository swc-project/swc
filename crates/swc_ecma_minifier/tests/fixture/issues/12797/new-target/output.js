new function() {
    // `new.target` in a static initializer is `undefined`, even when the
    // enclosing function is called with `new`.
    class C {
        static set(x) {
            C.value = x;
        }
        static cache = console.log(new.target === void 0);
    }
    class D {
        static set(x) {
            D.value = x;
        }
        static cache = console.log(new.target === void 0);
    }
}();
