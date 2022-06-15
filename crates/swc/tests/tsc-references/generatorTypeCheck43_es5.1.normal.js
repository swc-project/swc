import _define_property from "@swc/helpers/src/_define_property.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var x;
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.t0 = _define_property;
                _ctx.t1 = {};
                _ctx.next = 4;
                return 0;
            case 4:
                _ctx.t2 = _ctx.sent;
                _ctx.t3 = regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                });
                x = (0, _ctx.t0)(_ctx.t1, _ctx.t2, _ctx.t3);
            case 7:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
