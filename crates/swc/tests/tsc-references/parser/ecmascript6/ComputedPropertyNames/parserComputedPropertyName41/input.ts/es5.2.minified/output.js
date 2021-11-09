var obj, key, value;
value = !0, (key = 0 in []) in (obj = {
}) ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = value;
