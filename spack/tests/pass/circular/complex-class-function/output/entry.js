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
console.log(a, a());
