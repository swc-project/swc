console.log('c');
class A {
    method() {
        return new B3();
    }
}
const A1 = A;
const A2 = A1;
const A3 = A1;
class B extends A3 {
}
const B1 = B;
const B2 = B1;
console.log(A2, B2);
const B3 = B1;
