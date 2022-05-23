function f() {}
function g(a) {
    return a || f;
}
console.log(g(false) === g(null));
