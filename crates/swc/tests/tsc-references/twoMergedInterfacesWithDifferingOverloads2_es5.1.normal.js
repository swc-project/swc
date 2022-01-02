var a;
var r = a();
var r2 = a(1);
var r3 = a(1, 2);
var G;
(function(G) {
    var a1;
    var r = a1();
    var r2 = a1(true);
    var r3 = a1(true, 2);
    var r4 = a1(1, true);
})(G || (G = {}));
