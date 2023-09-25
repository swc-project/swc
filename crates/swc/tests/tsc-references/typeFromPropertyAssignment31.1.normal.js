//// [typeFromPropertyAssignment31.ts]
function ExpandoMerge(n) {
    return n;
}
ExpandoMerge.p1 = 111;
ExpandoMerge.m = function(n) {
    return n + 1;
};
(function(ExpandoMerge) {
    ExpandoMerge.p2 = 222;
})(ExpandoMerge || (ExpandoMerge = {}));
ExpandoMerge.p4 = 44444; // ok
ExpandoMerge.p6 = 66666; // ok
ExpandoMerge.p8 = false; // type error
(function(ExpandoMerge) {
    ExpandoMerge.p3 = 333;
    ExpandoMerge.p4 = 4;
    ExpandoMerge.p5 = 5;
    ExpandoMerge.p6 = 6;
    ExpandoMerge.p7 = 7;
    ExpandoMerge.p8 = 6;
    ExpandoMerge.p9 = 7;
})(ExpandoMerge || (ExpandoMerge = {}));
ExpandoMerge.p5 = 555555; // ok
ExpandoMerge.p7 = 777777; // ok
ExpandoMerge.p9 = false; // type error
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge.p4 + ExpandoMerge.p5 + ExpandoMerge.p6 + ExpandoMerge.p7 + ExpandoMerge.p8 + ExpandoMerge.p9 + ExpandoMerge.m(12) + ExpandoMerge(1001);
