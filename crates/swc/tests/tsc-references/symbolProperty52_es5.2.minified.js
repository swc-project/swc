(function(obj, key, value) {
    key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value;
})({}, Symbol.nonsense, 0), ({})[Symbol.nonsense];
