function getC() {
    return C;
}
class C {
}
function a() {
    return new A();
}
class A extends getC() {
}
console.log(a, a());
