function getC2() {
    return C;
}
class C {
}
const getC1 = getC3;
const getC3 = getC2;
function a() {
    return new A();
}
class A extends getC1() {
}
const a1 = a;
const a2 = a1;
console.log(a2, a2());
