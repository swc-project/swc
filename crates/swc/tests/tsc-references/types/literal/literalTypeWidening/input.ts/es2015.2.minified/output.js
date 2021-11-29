var E;
export function Set(...keys) {
    const result = {
    };
    return keys.forEach((key)=>result[key] = !0
    ), result;
}
function keys1(obj) {
    return Object.keys(obj);
}
export { keys1 as keys };
const langCodeSet = Set("fr", "en", "es", "it", "nl");
export const langCodes = keys1(langCodeSet);
langCodes.map((code)=>({
        code
    })
);
let E;
(E = E || (E = {
}))[E.A = 0] = "A", E[E.B = 1] = "B", f(E.A);
