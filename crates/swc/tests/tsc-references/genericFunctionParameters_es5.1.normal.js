var x1 = f1(function(x4) {
    return x4;
}); // {}
var x2 = f2(function(x5) {
    return x5;
}); // number
var x3 = f3(function(x6) {
    return x6;
}); // Array<any>
var x = s(function(a) {
    return a.init();
}); // x is any, should have been {}
