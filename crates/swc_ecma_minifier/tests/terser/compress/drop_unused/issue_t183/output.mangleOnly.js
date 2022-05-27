function a(a) {
    function b(a) {
        if (a) return a;
        b(a - 1);
    }
    return b(a);
}
console.log(a("PASS"));
