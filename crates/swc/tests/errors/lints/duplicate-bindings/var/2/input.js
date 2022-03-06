function foo() {}
const foo = 1; // error

function bar() {}
var bar; // ok

function baz() {}
function baz() {} // ok
