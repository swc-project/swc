function ExpandoMerge1(n) {
    return n;
}
ExpandoMerge1.p1 = 111;
ExpandoMerge1.m = function(n) {
    return n + 1;
};
(function(ExpandoMerge) {
    ExpandoMerge.p2 = 222;
})(ExpandoMerge1 || (ExpandoMerge1 = {
}));
ExpandoMerge1.p4 = 44444; // ok
ExpandoMerge1.p6 = 66666; // ok
ExpandoMerge1.p8 = false; // type error
(function(ExpandoMerge) {
    ExpandoMerge.p3 = 333;
    ExpandoMerge.p4 = 4;
    ExpandoMerge.p5 = 5;
    ExpandoMerge.p6 = 6;
    ExpandoMerge.p7 = 7;
    ExpandoMerge.p8 = 6;
    ExpandoMerge.p9 = 7;
})(ExpandoMerge1 || (ExpandoMerge1 = {
}));
ExpandoMerge1.p5 = 555555; // ok
ExpandoMerge1.p7 = 777777; // ok
ExpandoMerge1.p9 = false; // type error
var n1 = ExpandoMerge1.p1 + ExpandoMerge1.p2 + ExpandoMerge1.p3 + ExpandoMerge1.p4 + ExpandoMerge1.p5 + ExpandoMerge1.p6 + ExpandoMerge1.p7 + ExpandoMerge1.p8 + ExpandoMerge1.p9 + ExpandoMerge1.m(12) + ExpandoMerge1(1001);
