//// [override16.ts]
class A {
}
class B extends A {
    constructor(...args){
        super(...args), this.foo = "string";
    }
}
