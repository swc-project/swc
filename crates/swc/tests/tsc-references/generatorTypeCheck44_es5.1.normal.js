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
                ({
                });
                _ctx.next = 3;
                return 0;
            case 3:
                _ctx.t0 = _ctx.sent;
                _ctx.next = 6;
                return 0;
            case 6:
                _ctx.t2 = _ctx.sent;
                _ctx.t1 = _mutatorMap[_ctx.t2];
                if (_ctx.t1) {
                    _ctx.next = 10;
                    break;
                }
                _ctx.t1 = {
                };
            case 10:
                _mutatorMap[_ctx.t0] = _ctx.t1;
                _ctx.next = 13;
                return 0;
            case 13:
                _ctx.t3 = _ctx.sent;
                _mutatorMap[_ctx.t3].get = function() {
                    return 0;
                };
                _defineEnumerableProperties(_obj, _mutatorMap);
                x = (0, _obj);
            case 17:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
