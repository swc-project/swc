//// [logicalOrOperatorWithTypeParameters.ts]
function fn1(t, u) {
    var r1 = t || t;
    var r2 = t || t;
    var r3 = t || u;
    var r4 = t || u;
}
function fn2(t, u, v) {
    var r1 = t || u;
    //var r2: T = t || u;
    var r3 = u || u;
    var r4 = u || u;
    var r5 = u || v;
    var r6 = u || v;
//var r7: T = u || v;
}
function fn3(t, u) {
    var r1 = t || u;
    var r2 = t || u;
    var r3 = t || {
        a: ''
    };
    var r4 = t || u;
}
