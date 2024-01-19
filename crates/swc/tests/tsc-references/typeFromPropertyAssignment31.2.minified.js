//// [typeFromPropertyAssignment31.ts]
var ExpandoMerge, ExpandoMerge1;
function ExpandoMerge2(n) {
    return n;
}
ExpandoMerge2.p1 = 111, ExpandoMerge2.m = function(n) {
    return n + 1;
}, ExpandoMerge = ExpandoMerge2 || (ExpandoMerge2 = {}), ExpandoMerge.p2 = 222, ExpandoMerge2.p4 = 44444, ExpandoMerge2.p6 = 66666, ExpandoMerge2.p8 = !1, ExpandoMerge1 = ExpandoMerge2 || (ExpandoMerge2 = {}), ExpandoMerge1.p3 = 333, ExpandoMerge1.p4 = 4, ExpandoMerge1.p5 = 5, ExpandoMerge1.p6 = 6, ExpandoMerge1.p7 = 7, ExpandoMerge1.p8 = 6, ExpandoMerge1.p9 = 7, ExpandoMerge2.p5 = 555555, ExpandoMerge2.p7 = 777777, ExpandoMerge2.p9 = !1, ExpandoMerge2.p1, ExpandoMerge2.p2, ExpandoMerge2.p3, ExpandoMerge2.p4, ExpandoMerge2.p5, ExpandoMerge2.p6, ExpandoMerge2.p7, ExpandoMerge2.p8, ExpandoMerge2.p9, ExpandoMerge2.m(12), ExpandoMerge2(1001);
