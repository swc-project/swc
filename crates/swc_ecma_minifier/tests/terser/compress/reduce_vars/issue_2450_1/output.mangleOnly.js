function b() {}
function a() {
    return b;
}
console.log(a() === a());
