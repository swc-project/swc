function getC() {
    return C;
}
class C {
}
function a() {
    return new A();
}
const getC1 = getC;
const getC2 = getC1;
class A extends getC2() {
}
const a1 = a;
const a2 = a1;
console.log(a2, a2());
