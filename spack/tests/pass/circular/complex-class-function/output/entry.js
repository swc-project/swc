function a() {
    return new A();
}
function getC() {
    return C;
}
class A extends getC() {
}
class C {
}
console.log(a, a());
