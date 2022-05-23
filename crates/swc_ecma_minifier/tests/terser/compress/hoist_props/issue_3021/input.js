var a = 1,
    b = 2;
(function () {
    b = a;
    if (a++ + b--) return 1;
    return;
    var b = {};
})();
console.log(a, b);
