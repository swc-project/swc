function init() {
    return globalThis.ready = !0, 1;
}
function main() {
    var r = init();
    console.log(globalThis.ready, r);
}
// Other builtin globals are just as writable.
function initMath() {
    return Math.ready = !0, 1;
}
function mainMath() {
    var r = initMath();
    console.log(Math.ready, r);
}
function initJSON() {
    return JSON.ready = !0, 1;
}
function mainJSON() {
    var r = initJSON();
    console.log(JSON.ready, r);
}
function initObject() {
    return Object.ready = !0, 1;
}
function mainObject() {
    var r = initObject();
    console.log(Object?.ready, r);
}
function initConsole() {
    return console.ready = !0, 1;
}
function mainConsole() {
    var r = initConsole();
    console.log(console.ready, r);
}
function mark(o) {
    return o.seen = !0, 1;
}
function mainParam() {
    var r = mark(Math);
    console.log(Math.seen, r);
}
// A non-writable property and the callee of a builtin method can still be
// read before the call.
function one() {
    return 1;
}
function mainConstant() {
    console.log(Math.PI, one());
}
function mainCallee() {
    console.log(one());
}
globalThis.a = 0, a = 1, console.log(globalThis.a, a), globalThis.b = 0, b = 1, console.log(globalThis.b, b), globalThis.c = 0, c = 1, console.log(globalThis?.c, c), globalThis.ready = !1, main(), Math.ready = !1, mainMath(), JSON.ready = !1, mainJSON(), Object.ready = !1, mainObject(), console.ready = !1, mainConsole(), Math.seen = !1, mainParam(), mainConstant(), mainCallee();
