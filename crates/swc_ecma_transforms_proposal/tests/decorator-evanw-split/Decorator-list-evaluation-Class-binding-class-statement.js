(() => {
    const fns = [];
    const capture = (fn) => {
        fns.push(fn);
        // Note: As far as I can tell, early reference to the class name should
        // throw a reference error because:
        //
        // 1. Class decorators run first in the top-level scope before entering
        //    BindingClassDeclarationEvaluation.
        //
        // 2. Class element decorators run in ClassDefinitionEvaluation, which
        //    runs ClassElementEvaluation for each class element before eventually
        //    running classEnv.InitializeBinding(classBinding, F).
        //
        assertThrows(() => fn(), ReferenceError);
        return () => { };
    };
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
    }
    const originalFoo = Foo;
    // Once we get here, these should all reference the now-initialized class,
    // either through classBinding (for class element decorators) or through
    // className (for decorators on the class itself).
    for (const fn of fns) {
        assertEq(() => fn(), originalFoo);
    }
    // Mutating a class binding is allowed in JavaScript. Let's test what
    // happens when we do this.
    Foo = null;
    // As far as I can tell, class decorators should observe this change because
    // they are evaluated in the top-level scope.
    const firstFn = fns.shift();
    assertEq(() => firstFn(), null);
    // But I believe class element decorators should not observe this change
    // because they are evaluated in the environment that exists for the
    // duration of ClassDefinitionEvaluation (i.e. classEnv, not env).
    for (const fn of fns) {
        assertEq(() => fn(), originalFoo);
    }
})();
