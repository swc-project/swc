function foo() {}
const foo = 1; // error

function bar() {}
var bar; // error

function baz() {}
function baz() {} // error

export {};
