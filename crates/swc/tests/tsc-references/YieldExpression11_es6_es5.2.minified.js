import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import regeneratorRuntime from "regenerator-runtime";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = regeneratorRuntime.mark(function foo1() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, foo;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, foo1);
    }), C;
}();
