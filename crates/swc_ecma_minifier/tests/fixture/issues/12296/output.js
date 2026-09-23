function f(x) {
    var g = ()=>C;
    if (x) return;
    class C {
    }
    return g();
}
function letTail(x) {
    var g = ()=>C;
    if (x) return;
    let C = ()=>{};
    return g();
}
function constTail(x) {
    var g = ()=>C;
    if (x) return;
    let C = ()=>{};
    return g();
}
function functionTail(x) {
    var g = ()=>C;
    if (!x) return g();
    function C() {}
}
function varTail(x) {
    var g = ()=>C;
    if (!x) {
        var C = ()=>{};
        return g();
    }
}
console.log(typeof f(!1), f(!0), typeof letTail(!1), letTail(!0), typeof constTail(!1), constTail(!0), typeof functionTail(!1), functionTail(!0), typeof varTail(!1), varTail(!0));
