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
                return _ctx.next = 3, 0;
            case 3:
                return _ctx.t0 = _ctx.sent, _ctx.next = 6, 0;
            case 6:
                if (_ctx.t2 = _ctx.sent, _ctx.t1 = _mutatorMap[_ctx.t2], _ctx.t1) {
                    _ctx.next = 10;
                    break;
                }
                _ctx.t1 = {
                };
            case 10:
                return _mutatorMap[_ctx.t0] = _ctx.t1, _ctx.next = 13, 0;
            case 13:
                _ctx.t3 = _ctx.sent, _mutatorMap[_ctx.t3].get = function() {
                    return 0;
                }, _defineEnumerableProperties(_obj, _mutatorMap), x = _obj;
            case 17:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}), _mutatorMap = {
};
