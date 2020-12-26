class Common {
}
const Common1 = Common;
const Common2 = Common1;
const Common3 = Common1;
class A extends Common3 {
}
class B extends Common2 {
}
const __default = B;
const B1 = __default;
const __default1 = A;
const A1 = __default1;
console.log(A1, B1);
