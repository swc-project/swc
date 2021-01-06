const a = 1;
const a1 = a;
const a2 = a1;
class A {
}
const A1 = A;
const A2 = A1;
const A3 = A1;
console.log(a2, A3);
const c = 3;
const c1 = c;
const c2 = c1;
const A4 = A1;
console.log(c2, A4);
const b = 2;
const b1 = b;
const b2 = b1;
console.log(b2, A2);
const a3 = a1;
console.log(a3);
