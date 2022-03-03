var M;
!function(M) {
    var obj, key, value;
    obj = {}, key = this.bar, value = 0, key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value;
}(M || (M = {}));
