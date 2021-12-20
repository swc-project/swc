function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _obj, _mutatorMap = {
};
_defineProperty(_obj = {
}, Symbol.iterator, 0), _defineProperty(_obj, Symbol.toPrimitive, function() {
}), _mutatorMap[Symbol.toStringTag] = _mutatorMap[Symbol.toStringTag] || {
}, _mutatorMap[Symbol.toStringTag].get = function() {
    return 0;
}, (function(obj, descs) {
    for(var key in descs){
        var desc = descs[key];
        desc.configurable = desc.enumerable = !0, "value" in desc && (desc.writable = !0), Object.defineProperty(obj, key, desc);
    }
    if (Object.getOwnPropertySymbols) for(var objectSymbols = Object.getOwnPropertySymbols(descs), i = 0; i < objectSymbols.length; i++){
        var sym = objectSymbols[i], desc = descs[sym];
        desc.configurable = desc.enumerable = !0, "value" in desc && (desc.writable = !0), Object.defineProperty(obj, sym, desc);
    }
})(_obj, _mutatorMap);
