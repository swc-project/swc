import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var tmp, x;
    return regeneratorRuntime.wrap(function g$(_ctx1) {
        while(1)switch(_ctx1.prev = _ctx1.next){
            case 0:
                ;
                _ctx1.next = 3;
                return 0;
            case 3:
                tmp = _ctx1.sent;
                x = (0, /*#__PURE__*/ function() {
                    "use strict";
                    function C() {
                        _class_call_check(this, C);
                    }
                    var _proto = C.prototype;
                    _proto[tmp] = regeneratorRuntime.mark(function _callee() {
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
                }());
            case 5:
            case "end":
                return _ctx1.stop();
        }
    }, _marked);
}
