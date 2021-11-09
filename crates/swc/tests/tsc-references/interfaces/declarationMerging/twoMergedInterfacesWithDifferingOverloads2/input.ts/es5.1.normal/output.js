var a1;
var r = a1();
var r2 = a1(1);
var r3 = a1(1, 2);
var G;
(function(G) {
    var a;
    var r = a();
    var r2 = a(true);
    var r3 = a(true, 2);
    var r4 = a(1, true);
})(G || (G = {
}));
