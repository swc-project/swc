var E;
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
export function Set(...keys1) {
    let result = {};
    return keys1.forEach((key)=>result[key] = !0), result;
}
export function keys(obj) {
    return Object.keys(obj);
}
let langCodeSet = Set('fr', 'en', 'es', 'it', 'nl');
export const langCodes = keys(langCodeSet);
langCodes.map((code)=>({
        code
    })), function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {})), f(E.A);
