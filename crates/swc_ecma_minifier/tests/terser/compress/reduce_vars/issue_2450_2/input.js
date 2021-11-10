function g() {
    function f() {}
    return f;
}
console.log(g() === g());
