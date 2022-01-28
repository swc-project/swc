function f() {}
function g() {
    return f;
}
console.log(g() === g());
