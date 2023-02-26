//// [equalityWithtNullishCoalescingAssignment.ts]
function f1(a) {
    a !== null && a !== void 0 ? a : a = true;
    if (a === false) {
        console.log(a);
    }
}
f1(false);
function f2() {
    var x = 0;
    x !== null && x !== void 0 ? x : x = 1;
    if (x === 0) {
        console.log(x);
    }
}
