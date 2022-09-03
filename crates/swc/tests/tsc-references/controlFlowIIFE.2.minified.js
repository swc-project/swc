//// [controlFlowIIFE.ts]
function f1() {
    let x = getStringOrNumber();
    "string" == typeof x && x.length;
}
function f2() {
    let x = getStringOrNumber();
    "string" == typeof x && x.length;
}
function f3() {
    let x = getStringOrNumber();
    "string" == typeof x && x.length;
}
let maybeNumber;
maybeNumber = 1, ++maybeNumber, maybeNumber++;
let test;
if (!test) throw Error('Test is not defined');
function f4() {}
function f5() {
    !function*() {
        yield 1;
    }();
}
function f6() {
    let v;
    !async function() {
        v = await 1;
    }();
}
test.slice(1);
