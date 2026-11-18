// Floating-point multiplication is not associative, so constant factors must
// not be regrouped unless the result is exact.
function days(x) {
    return 24 * x * 60 * 60;
}
function hours(x) {
    return 1000 * x * 60 * 60;
}
function months(x) {
    return 30.44 * x * 24 * 60 * 60 * 1000;
}
function mixed(x, y) {
    return x * y * 60 * 60;
}
function half(x) {
    return 0.5 * x * 2;
}
function quarter(x) {
    return 4 * x * 0.25;
}
// These products are exact, so regrouping them does not change the result.
function exact(x) {
    return [
        2 * x * 4,
        -1 * x * 2.25,
        2.25 * x * 1
    ];
}
console.log(days(365.2425)), console.log(hours(17 / 60)), console.log(months(1)), console.log(mixed(0.1, 22)), console.log(half(5e-324)), console.log(quarter(1e308)), console.log(exact(0.1).join(","));
