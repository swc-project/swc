import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
import "reflect-metadata";
var v0 = function() {
    var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(v1) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", v1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function(v1) {
        return _ref.apply(this, arguments);
    };
}().constructor;
var res = v0(function() {
    return Reflect.get(v3, "a");
});
console.log(res);
