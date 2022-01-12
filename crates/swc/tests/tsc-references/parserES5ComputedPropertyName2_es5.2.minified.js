var obj, key, value;
obj = {}, value = 1, (key = e) in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : obj[key] = value;
