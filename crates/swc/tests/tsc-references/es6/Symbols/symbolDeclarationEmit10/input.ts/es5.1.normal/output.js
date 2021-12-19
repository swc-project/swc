function _defineEnumerableProperties(obj1, descs) {
    for(var key in descs){
        var desc = descs[key];
        desc.configurable = desc.enumerable = true;
        if ("value" in desc) desc.writable = true;
        Object.defineProperty(obj1, key, desc);
    }
    if (Object.getOwnPropertySymbols) {
        var objectSymbols = Object.getOwnPropertySymbols(descs);
        for(var i = 0; i < objectSymbols.length; i++){
            var sym = objectSymbols[i];
            var desc = descs[sym];
            desc.configurable = desc.enumerable = true;
            if ("value" in desc) desc.writable = true;
            Object.defineProperty(obj1, sym, desc);
        }
    }
    return obj1;
}
var _obj, _mutatorMap = {
};
//@target: ES6
//@declaration: true
var obj = (_obj = {
}, _mutatorMap[Symbol.isConcatSpreadable] = _mutatorMap[Symbol.isConcatSpreadable] || {
}, _mutatorMap[Symbol.isConcatSpreadable].get = function() {
    return '';
}, _mutatorMap[Symbol.isConcatSpreadable] = _mutatorMap[Symbol.isConcatSpreadable] || {
}, _mutatorMap[Symbol.isConcatSpreadable].set = function(x) {
}, _defineEnumerableProperties(_obj, _mutatorMap), _obj);
