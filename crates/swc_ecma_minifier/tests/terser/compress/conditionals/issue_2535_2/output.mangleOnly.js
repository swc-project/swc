function a() {}
function b() {
    return "foo";
}
console.log(a() || true || b());
console.log(b() || true || a());
console.log((a() || true) && b());
console.log((b() || true) && a());
console.log((a() && true) || b());
console.log((b() && true) || a());
console.log(a() && true && b());
console.log(b() && true && a());
console.log(a() || false || b());
console.log(b() || false || a());
console.log((a() || false) && b());
console.log((b() || false) && a());
console.log((a() && false) || b());
console.log((b() && false) || a());
console.log(a() && false && b());
console.log(b() && false && a());
