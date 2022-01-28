var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));
