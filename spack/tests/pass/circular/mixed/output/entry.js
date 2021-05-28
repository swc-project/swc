class A {
    method() {
        return new B();
    }
}
class B extends A {
}
console.log('c');
console.log(A, B);
