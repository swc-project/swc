// @strict: true
const foo1 = a ? 1 : 2;
const foo2 = (a !== null && a !== void 0 ? a : 'foo') ? 1 : 2;
const foo3 = (a !== null && a !== void 0 ? a : 'foo') ? b !== null && b !== void 0 ? b : 'bar' : c !== null && c !== void 0 ? c : 'baz';
function f() {
    const foo4 = (a !== null && a !== void 0 ? a : 'foo') ? b !== null && b !== void 0 ? b : 'bar' : c !== null && c !== void 0 ? c : 'baz';
}
