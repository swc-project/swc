function t() {
    return function() {};
}
var n = t();
var r = n;
export function baseRest() {
    return r();
}
export { r as _setToString };
