!(function () {
    var a = 1;
    L: for (console.log(a); --a; ) continue L;
})();
