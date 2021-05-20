"use strict";
function foo(x) {
    return x ? bar() : baz();
    function bar() {
        return 7;
    }
    function baz() {
        return 8;
    }
}
console.log(foo(0), foo(1));
