(() => {
    let counter = 0;
    const dec = (_, ctx) => {
        ctx.metadata[ctx.name] = counter++;
    };
    @dec
    class Foo {
        @dec
        instanceField;
        @dec
        accessor instanceAccessor;
        @dec
        instanceMethod() { }
        @dec
        get instanceGetter() { return; }
        @dec
        set instanceSetter(_) { }
        @dec
        static staticField;
        @dec
        static accessor staticAccessor;
        @dec
        static staticMethod() { }
        @dec
        static get staticGetter() { return; }
        @dec
        static set staticSetter(_) { }
    }
    @dec
    class Bar extends Foo {
        @dec
        #instanceField;
        @dec
        accessor #instanceAccessor;
        @dec
        #instanceMethod() { }
        @dec
        get #instanceGetter() { return; }
        @dec
        set #instanceSetter(_) { }
        @dec
        static #staticField;
        @dec
        static accessor #staticAccessor;
        @dec
        static #staticMethod() { }
        @dec
        static get #staticGetter() { return; }
        @dec
        static set #staticSetter(_) { }
    }
    const order = (meta) => '' + [
        meta['staticAccessor'], meta['staticMethod'], meta['staticGetter'], meta['staticSetter'],
        meta['#staticAccessor'], meta['#staticMethod'], meta['#staticGetter'], meta['#staticSetter'],
        meta['instanceAccessor'], meta['instanceMethod'], meta['instanceGetter'], meta['instanceSetter'],
        meta['#instanceAccessor'], meta['#instanceMethod'], meta['#instanceGetter'], meta['#instanceSetter'],
        meta['staticField'], meta['#staticField'],
        meta['instanceField'], meta['#instanceField'],
        meta['Foo'], meta['Bar'],
    ];
    const foo = Foo[Symbol.metadata];
    const bar = Bar[Symbol.metadata];
    assertEq(() => order(foo), '0,1,2,3,,,,,4,5,6,7,,,,,8,,9,,10,');
    assertEq(() => Object.getPrototypeOf(foo), null);
    assertEq(() => order(bar), '0,1,2,3,11,12,13,14,4,5,6,7,15,16,17,18,8,19,9,20,10,21');
    assertEq(() => Object.getPrototypeOf(bar), foo);
    // Test an undecorated class
    class FooNoDec {
    }
    class BarNoDec extends FooNoDec {
    }
    assertEq(() => FooNoDec[Symbol.metadata], null);
    assertEq(() => BarNoDec[Symbol.metadata], null);
    // Test a class with no class decorator
    class FooOneDec {
        @dec
        x;
    }
    class BarOneDec extends FooOneDec {
        @dec
        y;
    }
    assertEq(() => JSON.stringify(FooOneDec[Symbol.metadata]), JSON.stringify({ x: 22 }));
    assertEq(() => JSON.stringify(BarOneDec[Symbol.metadata]), JSON.stringify({ y: 23 }));
    assertEq(() => Object.getPrototypeOf(BarOneDec[Symbol.metadata]), FooOneDec[Symbol.metadata]);
})();
