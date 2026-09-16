(function (c) {
    c = 1 + c;
    var c = 0;
    function f(n) { return n ? ++c + f(n - 1) : c; }
    console.log(f(2), c);
})(-1);
