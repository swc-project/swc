import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var x;
    return regeneratorRuntime.wrap(function g$(_ctx1) {
        while(1)switch(_ctx1.prev = _ctx1.next){
            case 0:
                x = /*#__PURE__*/ function() {
                    "use strict";
                    function C() {
                        _class_call_check(this, C);
                    }
                    var _proto = C.prototype;
                    _proto[yield 0] = regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _ctx.next = 2;
                                    return 0;
                                case 2:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    });
                    return C;
                }();
            case 1:
            case "end":
                return _ctx1.stop();
        }
    }, _marked);
}
