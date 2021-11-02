import regeneratorRuntime from "regenerator-runtime";
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
var _marked = regeneratorRuntime.mark(g);
var _obj, _mutatorMap = {
};
//@target: ES6
function g() {
    var x;
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                x = ({
                }, _mutatorMap[yield 0] = _mutatorMap[yield 0] || {
                }, _mutatorMap[yield 0].get = function() {
                    return 0;
                }, _defineEnumerableProperties(_obj, _mutatorMap), _obj);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
