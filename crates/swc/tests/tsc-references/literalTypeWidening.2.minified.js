//// [literalTypeWidening.ts]
import "@swc/helpers/_/_object_spread";
import "@swc/helpers/_/_object_without_properties";
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
var E, langCodeSet = Set('fr', 'en', 'es', 'it', 'nl');
export var langCodes = keys(langCodeSet);
langCodes.map(function(code) {
    return {
        code: code
    };
});
var E1 = ((E = E1 || {})[E.A = 0] = "A", E[E.B = 1] = "B", E);
f(0);
