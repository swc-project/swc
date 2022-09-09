var n = { a: 1, b: 2 };
function o(o) {
    n = { b: 3 };
    return o;
}
console.log(
    (function (n) {
        return [n.a, o(n.b), n.b];
    })(n).join(" ")
);
