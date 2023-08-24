//// [overloadTag1.js]
/**
 * @overload
 * @param {number} a 
 * @param {number} b
 * @returns {number} 
 *
 * @overload
 * @param {string} a
 * @param {boolean} b
 * @returns {string}
 *
 * @param {string | number} a
 * @param {string | number} b
 * @returns {string | number}
 */ export function overloaded(a, b) {
    if ("string" == typeof a && "string" == typeof b || "number" == typeof a && "number" == typeof b) return a + b;
    throw Error("Invalid arguments");
}
overloaded(1, 2), overloaded("zero", "one"), overloaded("a", !1);
/**
 * @overload
 * @param {number} a
 * @param {number} b
 * @returns {number}
 *
 * @overload
 * @param {string} a
 * @param {boolean} b
 * @returns {string}
 */ export function uncheckedInternally(a, b) {
    return a + b;
}
uncheckedInternally(1, 2), uncheckedInternally("zero", "one");
