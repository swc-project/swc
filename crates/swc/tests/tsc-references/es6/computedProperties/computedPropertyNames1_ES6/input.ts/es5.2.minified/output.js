var _obj, _mutatorMap = {
};
_obj = {
}, _mutatorMap[1] = _mutatorMap[1] || {
}, _mutatorMap[1].get = function() {
    return 0;
}, _mutatorMap[1] = _mutatorMap[1] || {
}, _mutatorMap[1].set = function(v) {
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
