function x() {
}
function y() {
    return "foo";
}
console.log((x() || false) && y());