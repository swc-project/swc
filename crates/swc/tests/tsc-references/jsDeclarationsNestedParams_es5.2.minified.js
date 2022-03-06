import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var X = function() {
    "use strict";
    function X() {
        swcHelpers.classCallCheck(this, X);
    }
    return X.prototype.cancel = function(param) {
        return param.reason, param.code, swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
        swcHelpers.classCallCheck(this, Y);
    }
    return Y.prototype.cancel = function(param) {
        return param.reason, param.suberr, swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
