//// [assignParameterPropertyToPropertyDeclarationESNext.ts]
class C {
    m1() {
        this.foo // ok
        ;
    }
    constructor(foo){
        this.foo = foo;
        this.qux = this.bar // should error
        ;
        this.bar = this.foo // should error
        ;
        this.quiz = this.bar // ok
        ;
        this.quench = this.m1() // ok
        ;
        this.quanch = this.m3() // should error
        ;
        this.m3 = function() {};
        this.quim = this.baz // should error
        ;
        this.baz = this.foo;
        this.quid = this.baz // ok
        ;
    }
    m2() {
        this.foo // ok
        ;
    }
}
class D extends C {
    quill = this.foo // ok
    ;
}
class E {
    constructor(foo2){
        this.foo2 = foo2;
        this.bar = ()=>this.foo1 + this.foo2;
        this.foo1 = '';
    }
}
class F {
    Inner = class extends F {
        p2 = this.p1;
    };
    p1 = 0;
}
class G {
    constructor(p1){
        this.p1 = p1;
        this.Inner = class extends G {
            p2 = this.p1;
        };
    }
}
class H {
    constructor(p1){
        this.p1 = p1;
        this.p2 = ()=>{
            return this.p1.foo;
        };
        this.p3 = ()=>this.p1.foo;
    }
}
