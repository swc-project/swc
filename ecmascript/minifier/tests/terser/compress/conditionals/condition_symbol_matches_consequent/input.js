function foo(x, y) {
    return x ? x : y;
}
function bar() {
    return g ? g : h;
}
var g = 4;
var h = 5;
console.log(foo(3, null), foo(0, 7), foo(true, false), bar());
