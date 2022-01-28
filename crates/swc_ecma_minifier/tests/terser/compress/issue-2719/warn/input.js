function f() {
    return g();
}
function g() {
    return g["call" + "er"].arguments;
}
console.log(f(1, 2, 3).length);
