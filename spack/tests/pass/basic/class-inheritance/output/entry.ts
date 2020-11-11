class B {
}
const B1 = B;
class A extends B1 {
}
const A1 = A;
console.log('foo');
new A1();
