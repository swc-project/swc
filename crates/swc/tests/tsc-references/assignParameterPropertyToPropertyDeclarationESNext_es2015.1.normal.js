// @useDefineForClassFields: true
// @target: esnext
class C {
    m1() {
        this.foo // ok
        ;
    }
    m2() {
        this.foo // ok
        ;
    }
    constructor(foo){
        this.foo = foo;
        this.qux // should error
         = this.bar;
        this.bar // should error
         = this.foo;
        this.quiz // ok
         = this.bar;
        this.quench // ok
         = this.m1();
        this.quanch // should error
         = this.m3();
        this.m3 = function() {};
        this.quim // should error
         = this.baz;
        this.baz // should error
         = this.foo;
        this.quid // ok
         = this.baz;
    }
}
class D extends C {
    constructor(...args){
        super(...args);
        this.quill // ok
         = this.foo;
    }
}
class E {
    constructor(foo2){
        this.foo2 = foo2;
        this.bar // both ok
         = ()=>this.foo1 + this.foo2
        ;
        this.foo1 = '';
    }
}
class F {
    constructor(){
        this.Inner = class extends F {
            constructor(...args){
                super(...args);
                this.p2 = this.p1;
            }
        };
        this.p1 = 0;
    }
}
class G {
    constructor(p1){
        this.p1 = p1;
        this.Inner = class extends G {
            constructor(...args){
                super(...args);
                this.p2 = this.p1;
            }
        };
    }
}
class H {
    constructor(p1){
        this.p1 = p1;
        this.p2 = ()=>{
            return this.p1.foo;
        };
        this.p3 = ()=>this.p1.foo
        ;
    }
}
