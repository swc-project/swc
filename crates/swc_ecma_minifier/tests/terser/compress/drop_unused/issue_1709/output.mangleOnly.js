console.log((function a() {
    var a = 1;
    return a;
})(), (function a() {
    const a = 2;
    return a;
})(), (function a() {
    function a() {}
    return a;
})());
