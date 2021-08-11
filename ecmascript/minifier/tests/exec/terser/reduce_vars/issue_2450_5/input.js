var a;
function f(b) {
    console.log(a === b);
    a = b;
}
function g() {}
[1, 2, 3].forEach(function () {
    f(g);
});
