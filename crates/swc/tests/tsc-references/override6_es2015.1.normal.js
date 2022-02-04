// @declaration: true
// @noImplicitOverride: true
class B {
    constructor(foo, bar){
        this.foo = foo;
        this.bar = bar;
        this.baz = 1;
    }
}
class D extends B {
    constructor(foo, baz){
        super(foo, 42);
        this.foo = foo;
        this.baz = baz;
        this.bar = 1;
    }
}
