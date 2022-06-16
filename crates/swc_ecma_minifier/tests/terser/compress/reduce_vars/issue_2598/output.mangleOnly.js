function a() {}
function b(b) {
    return b || a;
}
console.log(b(false) === b(null));
