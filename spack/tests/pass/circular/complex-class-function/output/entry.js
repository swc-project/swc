function a() {
    return new A();
}
class A extends getC() {
}
function getC() {
    return C;
}
class C {
}
const a1 = a;
console.log(a1, a1());
