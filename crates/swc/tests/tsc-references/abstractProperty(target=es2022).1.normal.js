//// [abstractProperty.ts]
class A {
    foo() {
        console.log(this.x);
    }
}
class B extends A {
    x = 'B.x';
}
class C extends A {
    get x() {
        return 'C.x';
    }
}
