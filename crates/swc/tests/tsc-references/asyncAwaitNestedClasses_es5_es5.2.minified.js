import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _B, A = function() {
    swcHelpers.classCallCheck(this, A);
};
A.B = ((_B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return B.func2 = function() {
        return new Promise(function(resolve) {
            resolve(null);
        });
    }, B;
}()).C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.func = function() {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, _B.func2();
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C;
}(), _B), A.B.C.func();
