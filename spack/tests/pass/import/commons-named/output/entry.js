class Common {
}
const Common1 = Common;
class A extends Common1 {
}
const __default = A;
const A1 = __default;
class B extends Common1 {
}
const __default1 = B;
const B1 = __default1;
console.log(A1, B1);
