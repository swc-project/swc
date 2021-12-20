var E1, E2, obj, key, E1, E2;
(E1 = E1 || (E1 = {
}))[E1.x = 0] = "x", (E2 = E2 || (E2 = {
}))[E2.x = 0] = "x", obj = {
}, (key = E1.x || E2.x) in obj ? Object.defineProperty(obj, key, {
    value: 0,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = 0;
