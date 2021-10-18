foo("", function(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}({
}, Symbol.unscopables, function(s) {
    return s.length;
}));
