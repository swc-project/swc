//// [abstractProperty.ts]
class A {
    foo() {
        console.log(this.x);
    }
}
class B extends A {
    constructor(...args){
        super(...args);
        this.x = 'B.x';
    }
}
class C extends A {
    get x() {
        return 'C.x';
    }
}
