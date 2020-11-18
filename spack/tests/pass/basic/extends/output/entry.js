class B {
}
const B1 = B;
const B2 = B1;
class A extends B2 {
}
const A1 = A;
const A2 = A1;
const B3 = B1;
console.log(A2, B3);
