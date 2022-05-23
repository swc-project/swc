function shortOut() {
    return function () {};
}
var setToString = shortOut();
var _setToString = setToString;
export function baseRest() {
    return _setToString();
}
export { _setToString };
