var E, E1;
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
), (E1 = E || (E = {
}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", f(E.A);
