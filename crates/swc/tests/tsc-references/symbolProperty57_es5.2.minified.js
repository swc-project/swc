var obj, key, value;
(obj = {}, value = 0, (key = Symbol.iterator) in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = value, obj)[Symbol.nonsense];
