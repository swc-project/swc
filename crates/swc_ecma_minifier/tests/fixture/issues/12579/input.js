globalThis.a = 0;
a = 1;
console.log(globalThis.a, a);

globalThis.b = 0;
b = 1;
console.log(globalThis["b"], b);

globalThis.c = 0;
c = 1;
console.log(globalThis?.c, c);

function init() {
    globalThis.ready = true;
    return 1;
}
function main() {
    var r = init();
    console.log(globalThis.ready, r);
}
globalThis.ready = false;
main();

// Other builtin globals are just as writable.
function initMath() {
    Math.ready = true;
    return 1;
}
function mainMath() {
    var r = initMath();
    console.log(Math.ready, r);
}
Math.ready = false;
mainMath();

function initJSON() {
    JSON.ready = true;
    return 1;
}
function mainJSON() {
    var r = initJSON();
    console.log(JSON["ready"], r);
}
JSON.ready = false;
mainJSON();

function initObject() {
    Object.ready = true;
    return 1;
}
function mainObject() {
    var r = initObject();
    console.log(Object?.ready, r);
}
Object.ready = false;
mainObject();

function initConsole() {
    console.ready = true;
    return 1;
}
function mainConsole() {
    var r = initConsole();
    console.log(console.ready, r);
}
console.ready = false;
mainConsole();

function mark(o) {
    o.seen = true;
    return 1;
}
function mainParam() {
    var r = mark(Math);
    console.log(Math.seen, r);
}
Math.seen = false;
mainParam();

// A non-writable property and the callee of a builtin method can still be
// read before the call.
function one() {
    return 1;
}
function mainConstant() {
    var r = one();
    console.log(Math.PI, r);
}
mainConstant();

function mainCallee() {
    var r = one();
    console.log(r);
}
mainCallee();
