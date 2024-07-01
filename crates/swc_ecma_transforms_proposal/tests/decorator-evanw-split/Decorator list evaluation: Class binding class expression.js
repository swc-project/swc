(() => {
    const fns = [];
    const capture = (fn) => {
        fns.push(fn);
        return () => { };
    };
    const originalFoo = (
    @(capture(() => Foo))
    class Foo {
        @(capture(() => Foo))
        method() { }
        @(capture(() => Foo))
        static method() { }
        @(capture(() => Foo))
        field;
        @(capture(() => Foo))
        static field;
        @(capture(() => Foo))
        get getter() { return; }
        @(capture(() => Foo))
        static get getter() { return; }
        @(capture(() => Foo))
        set setter(x) { }
        @(capture(() => Foo))
        static set setter(x) { }
        @(capture(() => Foo))
        accessor accessor;
        @(capture(() => Foo))
        static accessor accessor;
    });
    // Decorators on the class itself should reference a global called "Foo",
    // which should still be a reference error. This is because a class
    // expression runs "DecoratorListEvaluation" in the outer environment and
    // then passes the evaluated decorators to "ClassDefinitionEvaluation".
    const firstFn = fns.shift();
    assertThrows(() => firstFn(), ReferenceError);
    // All other decorators should reference the classBinding called "Foo",
    // which should now be initialized. This is because all other decorators
    // are evaluated within "ClassDefinitionEvaluation" while the running
    // execution context's environment is the nested class environment.
    for (const fn of fns) {
        assertEq(() => fn(), originalFoo);
    }
})();
