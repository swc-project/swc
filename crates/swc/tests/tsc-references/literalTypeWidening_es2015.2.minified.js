var E;
import * as swcHelpers from "@swc/helpers";
export function Set(...keys1) {
    let result = {};
    return keys1.forEach((key)=>result[key] = !0
    ), result;
}
export function keys(obj) {
    return Object.keys(obj);
}
let langCodeSet = Set('fr', 'en', 'es', 'it', 'nl');
export const langCodes = keys(langCodeSet);
langCodes.map((code)=>({
        code
    })
), function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {})), f(E.A);
