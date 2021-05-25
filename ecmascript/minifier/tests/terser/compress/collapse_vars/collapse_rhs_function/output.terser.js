var a, b;
function f() {
    a = function () {};
    b = function () {};
    return function () {};
}
var c = f();
console.log(a === b, b === c, c === a);
