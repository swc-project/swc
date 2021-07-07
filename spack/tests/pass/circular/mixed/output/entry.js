console.log('c');
class A {
    method() {
        return new B();
    }
}
class B extends A {
}
console.log(A, B);
