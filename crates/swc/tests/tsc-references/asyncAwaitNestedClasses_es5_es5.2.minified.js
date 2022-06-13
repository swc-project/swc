import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _B, A = function() {
    "use strict";
    _class_call_check(this, A);
};
A.B = ((_B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.func2 = function() {
        return new Promise(function(resolve) {
            resolve(null);
        });
    }, B;
}()).C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.func = function() {
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
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
