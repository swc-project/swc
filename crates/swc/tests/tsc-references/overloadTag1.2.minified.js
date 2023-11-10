//// [overloadTag1.js]
export function overloaded(a, b) {
    if ("string" == typeof a && "string" == typeof b || "number" == typeof a && "number" == typeof b) return a + b;
    throw Error("Invalid arguments");
}
overloaded(1, 2), overloaded("zero", "one"), overloaded("a", !1);
export function uncheckedInternally(a, b) {
    return a + b;
}
uncheckedInternally(1, 2), uncheckedInternally("zero", "one");
