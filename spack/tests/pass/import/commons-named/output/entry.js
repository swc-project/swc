class Common {
}
const Common1 = Common;
const Common2 = Common1;
class A extends Common2 {
}
const __default = A;
const A1 = __default;
const Common3 = Common1;
class B extends Common3 {
}
const __default1 = B;
const B1 = __default1;
console.log(A1, B1);
