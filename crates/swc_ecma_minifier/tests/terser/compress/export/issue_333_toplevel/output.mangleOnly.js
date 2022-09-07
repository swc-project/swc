function n() {
    return function () {};
}
var r = n();
var t = r;
export function baseRest() {
    return t();
}
export { t as _setToString };
