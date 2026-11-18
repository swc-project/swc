var f = function g(a = g) {
    return a;
};
console.log(f() === f);
console.log(f(f) === f);

var nested = function h(a = () => h) {
    return a();
};
console.log(nested() === nested);
