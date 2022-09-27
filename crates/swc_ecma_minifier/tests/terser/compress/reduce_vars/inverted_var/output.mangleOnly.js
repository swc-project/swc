console.log((function() {
    var n = 1;
    return n;
})(), (function() {
    var n;
    n = 2;
    return n;
})(), (function() {
    n = 3;
    return n;
    var n;
})(), (function(n) {
    n = 4;
    return n;
})(), (function(n) {
    n = 5;
    return n;
    var n;
})(), (function n() {
    n = 6;
    return n;
})(), (function n() {
    r = 7;
    return r;
    var r;
})(), (function() {
    n = 8;
    return n;
    var n = "foo";
})());
