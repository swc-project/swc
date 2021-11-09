function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _obj, _mutatorMap = {
}, i1 = (_defineProperty(_obj = {
}, Symbol.iterator, 0), _defineProperty(_obj, Symbol.toStringTag, function() {
    return "";
}), _mutatorMap[Symbol.toPrimitive] = _mutatorMap[Symbol.toPrimitive] || {
}, _mutatorMap[Symbol.toPrimitive].set = function(p) {
}, function(obj, descs) {
    for(var key in descs){
        var desc = descs[key];
        desc.configurable = desc.enumerable = !0, "value" in desc && (desc.writable = !0), Object.defineProperty(obj, key, desc);
    }
    if (Object.getOwnPropertySymbols) for(var objectSymbols = Object.getOwnPropertySymbols(descs), i = 0; i < objectSymbols.length; i++){
        var sym = objectSymbols[i], desc = descs[sym];
        desc.configurable = desc.enumerable = !0, "value" in desc && (desc.writable = !0), Object.defineProperty(obj, sym, desc);
    }
}(_obj, _mutatorMap), _obj);
i1[Symbol.iterator], i1[Symbol.toStringTag](), i1[Symbol.toPrimitive] = !1;
