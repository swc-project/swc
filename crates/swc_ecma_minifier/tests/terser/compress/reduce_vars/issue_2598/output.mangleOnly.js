function b() {}
function a(a) {
    return a || b;
}
console.log(a(false) === a(null));
