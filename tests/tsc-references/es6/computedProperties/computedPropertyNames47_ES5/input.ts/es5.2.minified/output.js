var E1, E2, obj, key, E11, E21;
(E1 = E11 || (E11 = {
}))[E1.x = 0] = "x", (E2 = E21 || (E21 = {
}))[E2.x = 0] = "x", obj = {
}, (key = E11.x || E21.x) in obj ? Object.defineProperty(obj, key, {
    value: 0,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = 0;
