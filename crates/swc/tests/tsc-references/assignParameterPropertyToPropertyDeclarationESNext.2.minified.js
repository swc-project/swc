//// [assignParameterPropertyToPropertyDeclarationESNext.ts]
class C {
    foo;
    qux = this.bar;
    bar = this.foo;
    quiz = this.bar;
    quench = this.m1();
    quanch = this.m3();
    m1() {
        this.foo;
    }
    m3 = function() {};
    constructor(foo){
        this.foo = foo;
    }
    quim = this.baz;
    baz = this.foo;
    quid = this.baz;
    m2() {
        this.foo;
    }
}
class D extends C {
    quill = this.foo;
}
