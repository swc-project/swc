import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
export var foo = function() {
    var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    try {
                        console.log(1);
                    } catch (err) {
                        console.log(err.message);
                    }
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
