import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
var x = 42;
function f() {
    var ref = _object_destructuring_empty(x);
    console.log(x);
}
f();
