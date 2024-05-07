var _object_destructuring_empty = require("@swc/helpers/_/_object_destructuring_empty");
var x = 42;
function f() {
    var ref = _object_destructuring_empty._(x);
    console.log(x);
}
f();
