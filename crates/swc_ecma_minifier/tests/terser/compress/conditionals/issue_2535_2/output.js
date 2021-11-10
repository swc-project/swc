function x() {}
function y() {
    return "foo";
}
console.log(x() || !0);
console.log(y() || !0);
console.log((x(), y()));
console.log((y(), x()));
console.log(!!x() || y());
console.log(!!y() || x());
console.log(x() && y());
console.log(y() && x());
console.log(x() || y());
console.log(y() || x());
console.log(!!x() && y());
console.log(!!y() && x());
console.log((x(), y()));
console.log((y(), x()));
console.log(x() && !1);
console.log(y() && !1);
