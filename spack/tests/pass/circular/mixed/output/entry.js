class A {
    method() {
        return new B2();
    }
}
const A1 = A;
const A2 = A1;
console.log('c');
class B extends A2 {
}
const B1 = B;
const B2 = B1;
const A3 = A1;
const B3 = B1;
console.log(A3, B3);
