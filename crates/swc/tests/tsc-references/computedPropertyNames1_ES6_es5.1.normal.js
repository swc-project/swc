function _defineEnumerableProperties(obj, descs) {
    for(var key in descs){
        var desc = descs[key];
        desc.configurable = desc.enumerable = true;
        if ("value" in desc) desc.writable = true;
        Object.defineProperty(obj, key, desc);
    }
    if (Object.getOwnPropertySymbols) {
        var objectSymbols = Object.getOwnPropertySymbols(descs);
        for(var i = 0; i < objectSymbols.length; i++){
            var sym = objectSymbols[i];
            var desc = descs[sym];
            desc.configurable = desc.enumerable = true;
            if ("value" in desc) desc.writable = true;
            Object.defineProperty(obj, sym, desc);
        }
    }
    return obj;
}
var _obj, _mutatorMap = {
};
// @target: es6
var v = (_obj = {
}, _mutatorMap[0 + 1] = _mutatorMap[0 + 1] || {
}, _mutatorMap[0 + 1].get = function() {
    return 0;
}, _mutatorMap[0 + 1] = _mutatorMap[0 + 1] || {
} //No error
, _mutatorMap[0 + 1].set = function(v) {
}, _defineEnumerableProperties(_obj, _mutatorMap), _obj);
