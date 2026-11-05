// Floating-point multiplication is not associative, so constant factors must
// not be regrouped unless the result is exact.
function days(x) {
    return x * 24 * 60 * 60;
}
function hours(x) {
    return x * 1000 * 60 * 60;
}
function months(x) {
    return x * 30.44 * 24 * 60 * 60 * 1000;
}
function mixed(x, y) {
    return x * y * 60 * 60;
}
function half(x) {
    return x * 0.5 * 2;
}
function quarter(x) {
    return x * 4 * 0.25;
}

console.log(days(365.2425));
console.log(hours(17 / 60));
console.log(months(1));
console.log(mixed(0.1, 22));
console.log(half(5e-324));
console.log(quarter(1e308));

// These products are exact, so regrouping them does not change the result.
function exact(x) {
    return [x * 2 * 4, x * -1 * 2.25, x * 2.25 * 1];
}
console.log(exact(0.1).join(","));
