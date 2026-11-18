function conditional(cond) {
    let a, b = [];
    (cond ? a = [] : b = [])[0] = 3, console.log(cond ? a[0] : b[0]);
}
function logical(cond) {
    let a = [], b = [], c = [];
    (cond && (a = []) || [])[0] = 4, (cond || (b = []))[0] = 5, (cond ?? (c = []))[0] = 6, console.log(a[0], b[0], c[0]);
}
function nested(cond) {
    let a, b, c;
    (a = cond ? b = [] : c = []).push(8), console.log(a[0], b && b[0], c && c[0]);
}
!function() {
    let b;
    (b = [])[0] = 1, console.log(b[0]);
}(), function() {
    let b = [];
    b[0] = 2, console.log(b[0]);
}(), conditional(!0), conditional(!1), logical(!0), logical(!1), logical(null), function() {
    let b;
    (b = []).push(7), console.log(b[0]);
}(), nested(!0), nested(!1), function() {
    let a, b, c;
    (a ||= b = [])[0] = 9, (a &&= c = []).push(10), console.log(a[0], b[0], c[0]), (a = null, a ??= b = [])[0] = 11, console.log(b[0]);
}();
