//// [bug25618.js]
/** @type {<T>(param?: T) => T | undefined} */ function typed(param) {
    return param;
}
var n = typed(1);
