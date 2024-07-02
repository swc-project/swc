(() => {
    const fns = [];
    const capture = (fn) => {
        fns.push(fn);
        return () => { };
    };
    class Outer {
        static #foo = 0;
        static {
            (
            @(capture(() => Outer.#foo + 0))
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
            });
        }
    }
    // Accessing the outer "#foo" on "Outer" from within the class decorator
    // should succeed. Class decorators are evaluated in the outer private
    // environment before entering "ClassDefinitionEvaluation".
    //
    // Accessing the inner "#foo" on "Foo" from within any of the class element
    // decorators should also succeed. Class element decorators are evaluated
    // in the inner private environment inside "ClassDefinitionEvaluation".
    const log = [];
    for (const fn of fns)
        log.push(fn());
    assertEq(() => '' + log, '0,11,12,13,14,15,16,17,18,19,20');
})();
