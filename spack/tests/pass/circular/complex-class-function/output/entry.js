function a() {
    return new A();
}
const a1 = a;
const a2 = a1;
function getC() {
    return C;
}
const getC1 = getC;
const getC2 = getC1;
class C {
}
class A extends getC2() {
}
console.log(a2, a2());
