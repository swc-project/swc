const a = 1;
const a1 = a;
const b = 2;
const b1 = b;
class A {
}
const A1 = A;
const a2 = a1;
const A2 = A1;
console.log(a2, A2);
const c = 3;
const c1 = c;
const b2 = b1;
const A3 = A1;
console.log(b2, A3);
const c2 = c1;
const A4 = A1;
console.log(c2, A4);
const a3 = a1;
console.log(a3);
