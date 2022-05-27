function a() {
    function a() {
        return (a = 0), !!a;
    }
    return a();
}
console.log(a());
