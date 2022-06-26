import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    var _obj, _mutatorMap, x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _mutatorMap = {}, _obj = {}, _ctx.next = 4, 0;
            case 4:
                return _ctx.t0 = _ctx.sent, _ctx.next = 7, 0;
            case 7:
                if (_ctx.t2 = _ctx.sent, _ctx.t1 = _mutatorMap[_ctx.t2], _ctx.t1) {
                    _ctx.next = 11;
                    break;
                }
                _ctx.t1 = {};
            case 11:
                return _mutatorMap[_ctx.t0] = _ctx.t1, _ctx.next = 14, 0;
            case 14:
                _ctx.t3 = _ctx.sent, _mutatorMap[_ctx.t3].get = function() {
                    return 0;
                }, _define_enumerable_properties(_obj, _mutatorMap), x = _obj;
            case 18:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
});
