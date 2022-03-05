import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _foo = foo;
var C = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: _foo,
            value: regeneratorRuntime.mark(function value() {
                return regeneratorRuntime.wrap(function value$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                        case "end":
                            return _ctx.stop();
                    }
                }, value);
            })
        }
    ]);
    return C;
}();
