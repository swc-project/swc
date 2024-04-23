//// [nullishCoalescingOperator7.ts]
var foo1 = a ? 1 : 2;
var foo2 = (a !== null && a !== void 0 ? a : 'foo') ? 1 : 2;
var foo3 = (a !== null && a !== void 0 ? a : 'foo') ? b !== null && b !== void 0 ? b : 'bar' : c !== null && c !== void 0 ? c : 'baz';
function f() {
    var foo4 = (a !== null && a !== void 0 ? a : 'foo') ? b !== null && b !== void 0 ? b : 'bar' : c !== null && c !== void 0 ? c : 'baz';
}
