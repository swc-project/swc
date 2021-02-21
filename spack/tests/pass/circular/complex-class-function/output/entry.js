function a() {
    return new A();
}
function getC() {
    return C;
}
class C {
}
class A extends getC() {
}
console.log(a, a());
