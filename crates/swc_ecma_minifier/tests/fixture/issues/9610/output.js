function x(x) {
    return x;
}
function y(x) {
    return x;
}
function abc(a) {
    return x(a);
}
function abc2(a) {
    return y(a);
}
export function example() {
    return `${x(2)} ${y("2")} ${abc(3)} ${abc2("3")}`;
}
