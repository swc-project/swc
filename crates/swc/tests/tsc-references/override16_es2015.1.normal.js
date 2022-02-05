// @target: esnext,es2015
// @noImplicitOverride: true
class A {
}
class B extends A {
    constructor(...args){
        super(...args);
        this.foo = "string";
    }
}
