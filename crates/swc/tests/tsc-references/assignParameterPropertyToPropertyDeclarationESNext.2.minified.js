//// [assignParameterPropertyToPropertyDeclarationESNext.ts]
class C {
    qux;
    bar;
    quiz;
    quench;
    quanch;
    m1() {
        this.foo;
    }
    m3;
    constructor(foo){
        this.foo = foo, this.qux = this.bar, this.bar = this.foo, this.quiz = this.bar, this.quench = this.m1(), this.quanch = this.m3(), this.m3 = function() {}, this.quim = this.baz, this.baz = this.foo, this.quid = this.baz;
    }
    quim;
    baz;
    quid;
    m2() {
        this.foo;
    }
    foo;
}
class D extends C {
    quill = this.foo;
}
class E {
    bar;
    foo1;
    constructor(foo2){
        this.foo2 = foo2, this.bar = ()=>this.foo1 + this.foo2, this.foo1 = '';
    }
    foo2;
}
class F {
    Inner = class extends F {
        p2 = this.p1;
    };
    p1 = 0;
}
class G {
    Inner;
    constructor(p1){
        this.p1 = p1, this.Inner = class extends G {
            p2 = this.p1;
        };
    }
    p1;
}
class H {
    constructor(p1){
        this.p1 = p1, this.p2 = ()=>this.p1.foo, this.p3 = ()=>this.p1.foo;
    }
    p2;
    p3;
    p1;
}
