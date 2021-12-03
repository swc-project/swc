var E, E1;
export function Set(...keys1) {
    const result = {
    };
    return keys1.forEach((key)=>result[key] = !0
    ), result;
}
export function keys(obj) {
    return Object.keys(obj);
}
const langCodeSet = Set("fr", "en", "es", "it", "nl");
export const langCodes = keys(langCodeSet);
langCodes.map((code)=>({
        code
    })
), (E1 = E || (E = {
}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", f(E.A);
