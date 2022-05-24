import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
// @target: ES6
// @noEmitHelpers: true
var foo = function() {
    var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var v;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
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
