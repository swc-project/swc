var obj, key;
obj = {
}, (key = Symbol.nonsense) in obj ? Object.defineProperty(obj, key, {
    value: 0,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = 0, ({
})[Symbol.nonsense];
