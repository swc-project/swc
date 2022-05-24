// @target: esnext, es2022, es6, es5
class C {
    constructor(foo){
        this.foo = foo;
    }
}
C.create = ()=>new C("yep");
