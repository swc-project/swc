var a, b = 1, c = e;
function d(a) {
    return function() {
        c = 2;
    };
}
a = 2;
function e() {}
function f() {}
console.log((b = 3));
