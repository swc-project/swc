var x1 = f1(function(x) {
    return x;
}); // {}
var x2 = f2(function(x) {
    return x;
}); // number
var x3 = f3(function(x) {
    return x;
}); // Array<any>
var x = s(function(a) {
    return a.init();
}); // x is any, should have been {}
