// @target: esnext
// @useDefineForClassFields: true
class A {
    m() {}
}
class B extends A {
    constructor(...args){
        super(...args);
        this.m = ()=>1;
    }
}
