class Common {
}
const __default = Common;
const Common1 = __default;
const Common2 = __default;
class A extends Common2 {
}
class B extends Common1 {
}
const __default1 = B;
const B1 = __default1;
const __default2 = A;
const A1 = __default2;
console.log(A1, B1);
