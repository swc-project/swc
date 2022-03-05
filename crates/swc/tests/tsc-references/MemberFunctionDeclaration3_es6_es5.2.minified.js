import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _foo = foo, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: _foo,
            value: regeneratorRuntime.mark(function value() {
                return regeneratorRuntime.wrap(function(_ctx) {
                    for(;;)switch(_ctx.prev = _ctx.next){
                        case 0:
                        case "end":
                            return _ctx.stop();
                    }
                }, value);
            })
        }
    ]), C;
}();
