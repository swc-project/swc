import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.method = function() {
        var _this = this;
        _async_to_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, _this;
                    case 2:
                        return _ctx.abrupt("return", _ctx.sent);
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
    }, C;
}();
