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
        this.baz = this.foo // should error
        ;
        this.quid = this.baz // ok
        ;
    }
}
class D extends C {
    constructor(...args){
        super(...args);
        this.quill = this.foo // ok
        ;
    }
}
class E {
    constructor(foo2){
        this.foo2 = foo2;
        this.bar = ()=>this.foo1 + this.foo2
         // both ok
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
