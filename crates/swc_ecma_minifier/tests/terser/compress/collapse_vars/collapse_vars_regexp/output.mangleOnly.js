function r() {
    var r = 9;
    var n = /[A-Z]+/;
    return [
        n,
        r
    ];
}
function n() {
    var r = /ab*/g;
    return function(n) {
        return r.exec(n);
    };
}
(function() {
    var r;
    var n = "acdabcdeabbb";
    var a = /ab*/g;
    while((r = a.exec(n))){
        console.log(r[0]);
    }
})();
(function() {
    var r;
    var a = "acdabcdeabbb";
    var e = n();
    while((r = e(a))){
        console.log(r[0]);
    }
})();
