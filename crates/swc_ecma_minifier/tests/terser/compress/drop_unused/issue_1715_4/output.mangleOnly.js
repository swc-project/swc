var a = 1;
!(function a() {
    a++;
    try {
        x();
    } catch (b) {
        var b;
    }
})();
console.log(a);
