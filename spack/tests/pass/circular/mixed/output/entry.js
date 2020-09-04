class A {
    method() {
        return new B();
    }
}
console.log('c');
class B extends A {
}
console.log(A, B);
