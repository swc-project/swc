//// [nullishCoalescingOperator7.ts]
var foo1 = a ? 1 : 2, foo2 = (null != a ? a : "foo") ? 1 : 2, foo3 = (null != a ? a : "foo") ? null != b ? b : "bar" : null != c ? c : "baz";
function f() {}
