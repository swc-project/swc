function f() {
    return a;
    var a;
}
function g() {
    return a;
    var a = 1;
}
console.log(f(), g());
