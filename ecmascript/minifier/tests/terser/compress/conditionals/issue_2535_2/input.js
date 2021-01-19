function x() {}
function y() {
    return "foo";
}
console.log(x() || true || y());
console.log(y() || true || x());
console.log((x() || true) && y());
console.log((y() || true) && x());
console.log((x() && true) || y());
console.log((y() && true) || x());
console.log(x() && true && y());
console.log(y() && true && x());
console.log(x() || false || y());
console.log(y() || false || x());
console.log((x() || false) && y());
console.log((y() || false) && x());
console.log((x() && false) || y());
console.log((y() && false) || x());
console.log(x() && false && y());
console.log(y() && false && x());
