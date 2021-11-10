function x() {
}
function y() {
    return "foo";
}
console.log(y() || false || x());
