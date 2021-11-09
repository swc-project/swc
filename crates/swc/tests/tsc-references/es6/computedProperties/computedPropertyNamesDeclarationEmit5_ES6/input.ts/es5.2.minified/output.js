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
}, "", 0), _defineProperty(_obj, "", function() {
}), _mutatorMap[""] = _mutatorMap[""] || {
}, _mutatorMap[""].get = function() {
    return 0;
}, _mutatorMap[""] = _mutatorMap[""] || {
}, _mutatorMap[""].set = function(x) {
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
