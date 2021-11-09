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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var _obj, _mutatorMap = {
};
//@target: ES6
var i1 = (_obj = {
}, _defineProperty(_obj, Symbol.iterator, 0), _defineProperty(_obj, Symbol.toStringTag, function() {
    return "";
}), _mutatorMap[Symbol.toPrimitive] = _mutatorMap[Symbol.toPrimitive] || {
}, _mutatorMap[Symbol.toPrimitive].set = function(p) {
}, _defineEnumerableProperties(_obj, _mutatorMap), _obj);
var it = i1[Symbol.iterator];
var str = i1[Symbol.toStringTag]();
i1[Symbol.toPrimitive] = false;
