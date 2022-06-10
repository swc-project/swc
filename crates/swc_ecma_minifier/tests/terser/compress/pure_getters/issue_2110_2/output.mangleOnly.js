function a() {
    function a() {}
    function b() {
        return this;
    }
    a.g = b;
    return a.g();
}
console.log(typeof a());
