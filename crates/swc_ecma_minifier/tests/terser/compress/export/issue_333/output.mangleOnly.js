function a() {
    return function() {};
}
var b = a();
var c = b;
export function baseRest() {
    return c();
}
export { c as _setToString };
