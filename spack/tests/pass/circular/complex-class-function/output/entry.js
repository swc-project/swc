function a() {
    return new A();
}
const a1 = a;
function getC() {
    return C;
}
const getC1 = getC;
const getC2 = getC1;
class A extends getC2() {
}
class C {
}
const a2 = a1;
console.log(a2, a2());
