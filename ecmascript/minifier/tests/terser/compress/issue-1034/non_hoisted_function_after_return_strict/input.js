"use strict";
function foo(x) {
    if (x) {
        return bar();
        not_called1();
    } else {
        return baz();
        not_called2();
    }
    function bar() {
        return 7;
    }
    return not_reached;
    function UnusedFunction() {}
    function baz() {
        return 8;
    }
}
console.log(foo(0), foo(1));
