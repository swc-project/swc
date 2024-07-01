(() => {
    const fns = [];
    const capture = (fn) => {
        fns.push(fn);
        return () => { };
    };
    class Dummy {
        static #foo = NaN;
        static {
            @(capture(() => new Foo().#foo + 0))
            class Foo {
                #foo = 10;
                @(capture(() => new Foo().#foo + 1))
                method() { }
                @(capture(() => new Foo().#foo + 2))
                static method() { }
                @(capture(() => new Foo().#foo + 3))
                field;
                @(capture(() => new Foo().#foo + 4))
                static field;
                @(capture(() => new Foo().#foo + 5))
                get getter() { return; }
                @(capture(() => new Foo().#foo + 6))
                static get getter() { return; }
                @(capture(() => new Foo().#foo + 7))
                set setter(x) { }
                @(capture(() => new Foo().#foo + 8))
                static set setter(x) { }
                @(capture(() => new Foo().#foo + 9))
                accessor accessor;
                @(capture(() => new Foo().#foo + 10))
                static accessor accessor;
            }
        }
    }
    // Accessing "#foo" in the class decorator should fail. The "#foo" should
    // refer to the outer "#foo", not the inner "#foo".
    const firstFn = fns.shift();
    assertEq(() => {
        try {
            firstFn();
            throw new Error('Expected a TypeError to be thrown');
        }
        catch (err) {
            if (err instanceof TypeError)
                return true;
            throw err;
        }
    }, true);
    // Accessing "#foo" from any of the class element decorators should succeed.
    // Each "#foo" should refer to the inner "#foo", not the outer "#foo".
    const log = [];
    for (const fn of fns)
        log.push(fn());
    assertEq(() => '' + log, '11,12,13,14,15,16,17,18,19,20');
})();
