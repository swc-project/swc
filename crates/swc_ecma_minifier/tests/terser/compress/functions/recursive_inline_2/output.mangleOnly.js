function a(b) {
    return b ? b * a(b - 1) : 1;
}
console.log(a(5));
