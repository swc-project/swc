// @strict: true
// @target: esnext
// Repro from #30720
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
concatMaybe([
    1,
    2,
    3
], 4);
// Repros from #32247
var g = function() {
    var _ref = _async_to_generator(function(com) {
        return _ts_generator(this, function(_state) {
            throw com;
        });
    });
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
export { };
