(() => {
    const log = [];
    class Dummy {
        static #foo(n) {
            log.push(n);
            return () => { };
        }
        static {
            const dummy = this;
            @(dummy.#foo(0))
            class Foo extends (dummy.#foo(1), Object) {
                @(dummy.#foo(2))
                method() { }
                @(dummy.#foo(3))
                static method() { }
                @(dummy.#foo(4))
                field;
                @(dummy.#foo(5))
                static field;
                @(dummy.#foo(6))
                get getter() { return; }
                @(dummy.#foo(7))
                static get getter() { return; }
                @(dummy.#foo(8))
                set setter(x) { }
                @(dummy.#foo(9))
                static set setter(x) { }
                @(dummy.#foo(10))
                accessor accessor;
                @(dummy.#foo(11))
                static accessor accessor;
            }
        }
    }
    assertEq(() => '' + log, '0,1,2,3,4,5,6,7,8,9,10,11');
})();
