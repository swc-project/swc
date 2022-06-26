import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function f1() {
    let x = getStringOrNumber();
    if (typeof x === "string") {
        let n = function() {
            return x.length;
        }();
    }
}
function f2() {
    let x = getStringOrNumber();
    if (typeof x === "string") {
        let n = function() {
            return x.length;
        }();
    }
}
function f3() {
    let x = getStringOrNumber();
    let y;
    if (typeof x === "string") {
        let n = ((z)=>x.length + y + z)(y = 1);
    }
}
// Repros from #8381
let maybeNumber;
(function() {
    maybeNumber = 1;
})();
maybeNumber++;
if (maybeNumber !== undefined) {
    maybeNumber++;
}
let test;
if (!test) {
    throw new Error('Test is not defined');
}
(()=>{
    test.slice(1); // No error
})();
// Repro from #23565
function f4() {
    let v;
    (function() {
        v = 1;
    })();
    v;
}
function f5() {
    let v;
    (function*() {
        yield 1;
        v = 1;
    })();
    v; // still undefined
}
function f6() {
    let v;
    _async_to_generator(function*() {
        v = yield 1;
    })();
    v; // still undefined
}
