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
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var _obj, _mutatorMap, x;
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _mutatorMap = {};
                _obj = {};
                _ctx.next = 4;
                return 0;
            case 4:
                _ctx.t0 = _ctx.sent;
                _ctx.next = 7;
                return 0;
            case 7:
                _ctx.t2 = _ctx.sent;
                _ctx.t1 = _mutatorMap[_ctx.t2];
                if (_ctx.t1) {
                    _ctx.next = 11;
                    break;
                }
                _ctx.t1 = {};
            case 11:
                _mutatorMap[_ctx.t0] = _ctx.t1;
                _ctx.next = 14;
                return 0;
            case 14:
                _ctx.t3 = _ctx.sent;
                _mutatorMap[_ctx.t3].get = function() {
                    return 0;
                };
                _defineEnumerableProperties(_obj, _mutatorMap);
                x = (0, _obj);
            case 18:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
