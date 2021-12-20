// @Filename: expando.ts
function ExpandoMerge(n1) {
    return n1;
}
ExpandoMerge.p1 = 111;
ExpandoMerge.m = function(n2) {
    return n2 + 1;
};
ExpandoMerge.p4 = 44444;
ExpandoMerge.p5 = 555555;
ExpandoMerge.p6 = 66666;
ExpandoMerge.p7 = 777777;
ExpandoMerge.p8 = false; // type error
ExpandoMerge.p9 = false; // type error
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge.p4 + ExpandoMerge.p5 + ExpandoMerge.p6 + ExpandoMerge.p7 + ExpandoMerge.p8 + ExpandoMerge.p9 + ExpandoMerge.m(12) + ExpandoMerge(1001);
(function(ExpandoMerge1) {
    ExpandoMerge1.p3 = 333;
    ExpandoMerge1.p4 = 4;
    ExpandoMerge1.p5 = 5;
    ExpandoMerge1.p6 = 6;
    ExpandoMerge1.p7 = 7;
    ExpandoMerge1.p8 = 6;
    ExpandoMerge1.p9 = 7;
})(ExpandoMerge || (ExpandoMerge = {
}));
(function(ExpandoMerge2) {
    ExpandoMerge2.p2 = 222;
})(ExpandoMerge || (ExpandoMerge = {
}));
