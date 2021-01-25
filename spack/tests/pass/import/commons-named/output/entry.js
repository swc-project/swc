class Common {
}
const Common1 = Common;
const Common2 = Common1;
const Common3 = Common1;
class A extends Common3 {
}
const __default = A;
const __default1 = __default;
const A1 = __default1;
class B extends Common2 {
}
const __default2 = B;
const __default3 = __default2;
const B1 = __default3;
console.log(A1, B1);
