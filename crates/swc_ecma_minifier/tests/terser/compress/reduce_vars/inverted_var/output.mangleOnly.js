console.log((function() {
    var a = 1;
    return a;
})(), (function() {
    var a;
    a = 2;
    return a;
})(), (function() {
    a = 3;
    return a;
    var a;
})(), (function(a) {
    a = 4;
    return a;
})(), (function(a) {
    a = 5;
    return a;
    var a;
})(), (function a() {
    a = 6;
    return a;
})(), (function a() {
    a = 7;
    return a;
    var a;
})(), (function() {
    a = 8;
    return a;
    var a = "foo";
})());
