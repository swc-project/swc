import _define_property from "@swc/helpers/lib/_define_property.js";
import regeneratorRuntime from "regenerator-runtime";
foo("", regeneratorRuntime.mark(function _callee1() {
    return regeneratorRuntime.wrap(function(_ctx1) {
        for(;;)switch(_ctx1.prev = _ctx1.next){
            case 0:
                return _ctx1.delegateYield(_define_property({}, Symbol.iterator, regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, function(x) {
                                    return x.length;
                                };
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                })), "t0", 1);
            case 1:
            case "end":
                return _ctx1.stop();
        }
    }, _callee1);
}), function(p) {});
