function a() {}
function b() {
    return a;
}
console.log(b() === b());
