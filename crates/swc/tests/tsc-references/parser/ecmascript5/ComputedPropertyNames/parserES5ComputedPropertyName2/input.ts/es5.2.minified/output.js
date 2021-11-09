var obj, key;
obj = {
}, (key = e) in obj ? Object.defineProperty(obj, key, {
    value: 1,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = 1;
