var a = 0;
!(function b() {
    b && a++;
    var b = 0;
    b && a++;
})();
console.log(a);
