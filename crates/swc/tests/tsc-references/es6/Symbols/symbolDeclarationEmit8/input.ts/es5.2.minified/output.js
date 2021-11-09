var obj, key;
obj = {
}, (key = Symbol.isConcatSpreadable) in obj ? Object.defineProperty(obj, key, {
    value: 0,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = 0;
