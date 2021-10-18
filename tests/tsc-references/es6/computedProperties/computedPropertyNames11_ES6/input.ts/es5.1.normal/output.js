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
// @target: es6
var s;
var n;
var a;
var _obj, _mutatorMap = {
};
var v = (_obj = {
}, _mutatorMap[s] = _mutatorMap[s] || {
}, _mutatorMap[s].get = function() {
    return 0;
}, _mutatorMap[n] = _mutatorMap[n] || {
}, _mutatorMap[n].set = function(v) {
}, _mutatorMap[s + s] = _mutatorMap[s + s] || {
}, _mutatorMap[s + s].get = function() {
    return 0;
}, _mutatorMap[s + n] = _mutatorMap[s + n] || {
}, _mutatorMap[s + n].set = function(v) {
}, _mutatorMap[+s] = _mutatorMap[+s] || {
}, _mutatorMap[+s].get = function() {
    return 0;
}, _mutatorMap[""] = _mutatorMap[""] || {
}, _mutatorMap[""].set = function(v) {
}, _mutatorMap[0] = _mutatorMap[0] || {
}, _mutatorMap[0].get = function() {
    return 0;
}, _mutatorMap[a] = _mutatorMap[a] || {
}, _mutatorMap[a].set = function(v) {
}, _mutatorMap[true] = _mutatorMap[true] || {
}, _mutatorMap[true].get = function() {
    return 0;
}, _mutatorMap["hello bye"] = _mutatorMap["hello bye"] || {
}, _mutatorMap["hello bye"].set = function(v) {
}, _mutatorMap["hello ".concat(a, " bye")] = _mutatorMap["hello ".concat(a, " bye")] || {
}, _mutatorMap["hello ".concat(a, " bye")].get = function() {
    return 0;
}, _defineEnumerableProperties(_obj, _mutatorMap), _obj);
