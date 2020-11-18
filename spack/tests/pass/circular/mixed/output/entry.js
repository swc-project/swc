class A {
    method() {
        return new B();
    }
}
const A1 = A;
const A2 = A1;
console.log('c');
class B extends A2 {
}
const B1 = B;
const A3 = A1;
const B2 = B1;
console.log(A3, B2);
