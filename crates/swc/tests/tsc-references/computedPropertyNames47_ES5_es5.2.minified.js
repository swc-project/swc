var E1, E2, obj, key, value, E1, E2;
(E1 = E1 || (E1 = {}))[E1.x = 0] = "x", (E2 = E2 || (E2 = {}))[E2.x = 0] = "x", obj = {}, value = 0, (key = E1.x || E2.x) in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = value;
