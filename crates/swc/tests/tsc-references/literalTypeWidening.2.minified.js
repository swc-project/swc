//// [literalTypeWidening.ts]
import "@swc/helpers/src/_object_spread.mjs";
import "@swc/helpers/src/_object_without_properties.mjs";
export function Set() {
    for(var _len = arguments.length, _$keys = Array(_len), _key = 0; _key < _len; _key++)_$keys[_key] = arguments[_key];
    var result = {};
    return _$keys.forEach(function(key) {
        return result[key] = !0;
    }), result;
}
export function keys(obj) {
    return Object.keys(obj);
}
var E, langCodeSet = Set("fr", "en", "es", "it", "nl");
export var langCodes = keys(langCodeSet);
langCodes.map(function(code) {
    return {
        code: code
    };
}), function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {})), f(E.A);
