import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
concatMaybe([
    1,
    2,
    3
], 4);
// Repros from #32247
var g = function() {
    var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee(com) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    throw com;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function g(com) {
        return _ref.apply(this, arguments);
    };
}();
f1 = f2;
f2 = f1;
g1 = g2;
g2 = g1;
var x1 = foo1(sa); // string
var y1 = foo1(sx); // string
var x2 = foo2(sa); // unknown
var y2 = foo2(sx); // { extra: number }
withRouter(MyComponent);
var z = foo(ab); // [AB<string>, string]
// @strict: true
// @target: esnext
// Repro from #30720
export { };
