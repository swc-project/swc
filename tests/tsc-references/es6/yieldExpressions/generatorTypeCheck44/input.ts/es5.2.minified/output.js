import regeneratorRuntime from "regenerator-runtime";
function _defineEnumerableProperties(obj, descs) {
    for(var key in descs){
        var desc = descs[key];
        desc.configurable = desc.enumerable = !0, "value" in desc && (desc.writable = !0), Object.defineProperty(obj, key, desc);
    }
    if (Object.getOwnPropertySymbols) for(var objectSymbols = Object.getOwnPropertySymbols(descs), i = 0; i < objectSymbols.length; i++){
        var sym = objectSymbols[i], desc = descs[sym];
        desc.configurable = desc.enumerable = !0, "value" in desc && (desc.writable = !0), Object.defineProperty(obj, sym, desc);
    }
    return obj;
}
var _obj, _marked = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                x = (_mutatorMap[yield 0] = _mutatorMap[yield 0] || {
                }, _mutatorMap[yield 0].get = function() {
                    return 0;
                }, _defineEnumerableProperties(_obj, _mutatorMap), _obj);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}), _mutatorMap = {
};
