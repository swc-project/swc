function f() {
    return;
}
function g() {
    return a;
    var a = 1;
}
console.log(f(), g());
