//// [nullishCoalescingOperator6.ts]
function foo(foo) {
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
