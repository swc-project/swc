function a() {
    var a = 9;
    var r = /[A-Z]+/;
    return [
        r,
        a
    ];
}
function r() {
    var a = /ab*/g;
    return function(r) {
        return a.exec(r);
    };
}
(function() {
    var a;
    var r = "acdabcdeabbb";
    var n = /ab*/g;
    while((a = n.exec(r))){
        console.log(a[0]);
    }
})();
(function() {
    var a;
    var n = "acdabcdeabbb";
    var c = r();
    while((a = c(n))){
        console.log(a[0]);
    }
})();
