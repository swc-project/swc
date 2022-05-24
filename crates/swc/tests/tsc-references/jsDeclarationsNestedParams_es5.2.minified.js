import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import regeneratorRuntime from "regenerator-runtime";
var X = function() {
    "use strict";
    function X() {
        _class_call_check(this, X);
    }
    return X.prototype.cancel = function(param) {
        return param.reason, param.code, _async_to_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, X;
}(), Y = function() {
    "use strict";
    function Y() {
        _class_call_check(this, Y);
    }
    return Y.prototype.cancel = function(param) {
        return param.reason, param.suberr, _async_to_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, Y;
}();
