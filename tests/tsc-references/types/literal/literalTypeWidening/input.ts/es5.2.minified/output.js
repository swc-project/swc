var E, E1;
export function Set() {
    for(var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++)keys[_key] = arguments[_key];
    var result = {
    };
    return keys.forEach(function(key) {
        return result[key] = !0;
    }), result;
}
export function keys(obj) {
    return Object.keys(obj);
}
var langCodeSet = Set("fr", "en", "es", "it", "nl");
export var langCodes = keys(langCodeSet);
langCodes.map(function(code) {
    return {
        code: code
    };
}), (E = E1 || (E1 = {
}))[E.A = 0] = "A", E[E.B = 1] = "B", f(E1.A);
