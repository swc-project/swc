// @declaration: true
// @noImplicitOverride: true
class B {
    foo(v) {}
    fooo(v) {}
    constructor(){
        this.p1 = 1;
        this.p2 = 1;
    }
}
class D extends B {
    foo(v) {}
    fooo(v) {}
    constructor(...args){
        super(...args);
        this.p1 = 2;
        this.p2 = 3;
    }
}
class DD extends B {
}
