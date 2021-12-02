function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _obj, _mutatorMap = {
}, i = (_defineProperty(_obj = {
}, Symbol.iterator, 0), _defineProperty(_obj, Symbol.toStringTag, function() {
    return "";
}), _mutatorMap[Symbol.toPrimitive] = _mutatorMap[Symbol.toPrimitive] || {
}, _mutatorMap[Symbol.toPrimitive].set = function(p) {
}, function(obj, descs) {
    for(var key in descs){
        var desc = descs[key];
        desc.configurable = desc.enumerable = !0, "value" in desc && (desc.writable = !0), Object.defineProperty(obj, key, desc);
    }
    if (Object.getOwnPropertySymbols) for(var objectSymbols = Object.getOwnPropertySymbols(descs), i1 = 0; i1 < objectSymbols.length; i1++){
        var sym = objectSymbols[i1], desc = descs[sym];
        desc.configurable = desc.enumerable = !0, "value" in desc && (desc.writable = !0), Object.defineProperty(obj, sym, desc);
    }
}(_obj, _mutatorMap), _obj);
i[Symbol.iterator], i[Symbol.toStringTag](), i[Symbol.toPrimitive] = !1;
