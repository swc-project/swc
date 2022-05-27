import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx1) {
        for(;;)switch(_ctx1.prev = _ctx1.next){
            case 0:
                x = function() {
                    "use strict";
                    function C() {
                        _class_call_check(this, C);
                    }
                    return C.prototype[yield 0] = regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function(_ctx) {
                            for(;;)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    return _ctx.next = 2, 0;
                                case 2:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }), C;
                }();
            case 1:
            case "end":
                return _ctx1.stop();
        }
    }, _marked);
});
