//// [typeFromPropertyAssignment31.ts]
var ExpandoMerge, ExpandoMerge1;
function ExpandoMerge(n) {
    return n;
}
ExpandoMerge.p1 = 111, ExpandoMerge.m = function(n) {
    return n + 1;
}, (ExpandoMerge || (ExpandoMerge = {})).p2 = 222, ExpandoMerge.p4 = 44444, ExpandoMerge.p6 = 66666, ExpandoMerge.p8 = !1, (ExpandoMerge1 = ExpandoMerge || (ExpandoMerge = {})).p3 = 333, ExpandoMerge1.p4 = 4, ExpandoMerge1.p5 = 5, ExpandoMerge1.p6 = 6, ExpandoMerge1.p7 = 7, ExpandoMerge1.p8 = 6, ExpandoMerge1.p9 = 7, ExpandoMerge.p5 = 555555, ExpandoMerge.p7 = 777777, ExpandoMerge.p9 = !1, ExpandoMerge.p1, ExpandoMerge.p2, ExpandoMerge.p3, ExpandoMerge.p4, ExpandoMerge.p5, ExpandoMerge.p6, ExpandoMerge.p7, ExpandoMerge.p8, ExpandoMerge.p9, ExpandoMerge.m(12), ExpandoMerge(1001);
