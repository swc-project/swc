var _obj, _mutatorMap = {
};
(function(obj, key, value) {
    key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value;
})(_obj = {
}, "hello", function() {
}), _mutatorMap.goodbye = _mutatorMap.goodbye || {
}, _mutatorMap.goodbye.get = function() {
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
