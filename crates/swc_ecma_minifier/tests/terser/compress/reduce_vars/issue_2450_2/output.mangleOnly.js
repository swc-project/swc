function a() {
    function a() {}
    return a;
}
console.log(a() === a());
