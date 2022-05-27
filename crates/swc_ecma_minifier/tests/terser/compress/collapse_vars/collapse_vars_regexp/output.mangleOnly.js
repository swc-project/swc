function a() {
    var a = 9;
    var b = /[A-Z]+/;
    return [
        b,
        a
    ];
}
function b() {
    var a = /ab*/g;
    return function(b) {
        return a.exec(b);
    };
}
(function() {
    var a;
    var b = "acdabcdeabbb";
    var c = /ab*/g;
    while((a = c.exec(b))){
        console.log(a[0]);
    }
})();
(function() {
    var a;
    var c = "acdabcdeabbb";
    var d = b();
    while((a = d(c))){
        console.log(a[0]);
    }
})();
