function ExpandoMerge(n1) {
    return n1;
}
ExpandoMerge.p1 = 111;
ExpandoMerge.m = function(n2) {
    return n2 + 1;
};
(function(ExpandoMerge1) {
    ExpandoMerge1.p2 = 222;
})(ExpandoMerge || (ExpandoMerge = {
}));
ExpandoMerge.p4 = 44444; // ok
ExpandoMerge.p6 = 66666; // ok
ExpandoMerge.p8 = false; // type error
(function(ExpandoMerge2) {
    ExpandoMerge2.p3 = 333;
    ExpandoMerge2.p4 = 4;
    ExpandoMerge2.p5 = 5;
    ExpandoMerge2.p6 = 6;
    ExpandoMerge2.p7 = 7;
    ExpandoMerge2.p8 = 6;
    ExpandoMerge2.p9 = 7;
})(ExpandoMerge || (ExpandoMerge = {
}));
ExpandoMerge.p5 = 555555; // ok
ExpandoMerge.p7 = 777777; // ok
ExpandoMerge.p9 = false; // type error
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge.p4 + ExpandoMerge.p5 + ExpandoMerge.p6 + ExpandoMerge.p7 + ExpandoMerge.p8 + ExpandoMerge.p9 + ExpandoMerge.m(12) + ExpandoMerge(1001);
