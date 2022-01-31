function ExpandoMerge(n) {
    return n;
}
ExpandoMerge.p1 = 111;
ExpandoMerge.m = function(n) {
    return n + 1;
};
(function(ExpandoMerge1) {
    var p2 = ExpandoMerge1.p2 = 222;
})(ExpandoMerge || (ExpandoMerge = {}));
ExpandoMerge.p4 = 44444; // ok
ExpandoMerge.p6 = 66666; // ok
ExpandoMerge.p8 = false; // type error
(function(ExpandoMerge2) {
    var p3 = ExpandoMerge2.p3 = 333;
    var p4 = ExpandoMerge2.p4 = 4;
    var p5 = ExpandoMerge2.p5 = 5;
    var p6 = ExpandoMerge2.p6 = 6;
    var p7 = ExpandoMerge2.p7 = 7;
    var p8 = ExpandoMerge2.p8 = 6;
    var p9 = ExpandoMerge2.p9 = 7;
})(ExpandoMerge || (ExpandoMerge = {}));
ExpandoMerge.p5 = 555555; // ok
ExpandoMerge.p7 = 777777; // ok
ExpandoMerge.p9 = false; // type error
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge.p4 + ExpandoMerge.p5 + ExpandoMerge.p6 + ExpandoMerge.p7 + ExpandoMerge.p8 + ExpandoMerge.p9 + ExpandoMerge.m(12) + ExpandoMerge(1001);
