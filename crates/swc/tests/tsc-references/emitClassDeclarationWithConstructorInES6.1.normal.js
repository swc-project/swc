//// [emitClassDeclarationWithConstructorInES6.ts]
class A {
    foo() {}
    constructor(x){}
}
class B {
    baz(z, v) {
        return this._bar;
    }
    constructor(x, z = "hello", ...args){
        this.x = "hello";
        this.y = 10;
    }
}
