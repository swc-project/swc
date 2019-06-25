function ExpandoMerge(n: number) {
    return n;
}
ExpandoMerge.p1 = 111
ExpandoMerge.m = function(n: number) {
    return n + 1;
}
namespace ExpandoMerge {
    export var p2 = 222;
}
ExpandoMerge.p4 = 44444; // ok
ExpandoMerge.p6 = 66666; // ok
ExpandoMerge.p8 = false; // type error
namespace ExpandoMerge {
    export var p3 = 333;
    export var p4 = 4;
    export var p5 = 5;
    export let p6 = 6;
    export let p7 = 7;
    export var p8 = 6;
    export let p9 = 7;
}
ExpandoMerge.p5 = 555555; // ok
ExpandoMerge.p7 = 777777; // ok
ExpandoMerge.p9 = false; // type error
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge.p4 + ExpandoMerge.p5 + ExpandoMerge.p6 + ExpandoMerge.p7 + ExpandoMerge.p8 + ExpandoMerge.p9 + ExpandoMerge.m(12) + ExpandoMerge(1001);
