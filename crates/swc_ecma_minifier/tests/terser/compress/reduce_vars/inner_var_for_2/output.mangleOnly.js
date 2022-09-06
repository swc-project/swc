!(function () {
    var o = 1;
    for (var r = 1; --r; ) var o = 2;
    console.log(o);
})();
