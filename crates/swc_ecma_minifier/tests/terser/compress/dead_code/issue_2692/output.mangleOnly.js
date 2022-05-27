function a(a) {
    return (a = b);
    function b() {
        return a;
    }
}
console.log(typeof a()());
