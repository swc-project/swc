function a() {
    return (function a() {
        return (a = 0), !!a;
    })();
}
console.log(a());
