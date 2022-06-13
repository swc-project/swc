import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
concatMaybe([
    1,
    2,
    3
], 4);
// Repros from #32247
const g = function() {
    var _ref = _async_to_generator(function*(com) {
        throw com;
    });
    return function g(com) {
        return _ref.apply(this, arguments);
    };
}();
f1 = f2;
f2 = f1;
g1 = g2;
g2 = g1;
let x1 = foo1(sa); // string
let y1 = foo1(sx); // string
let x2 = foo2(sa); // unknown
let y2 = foo2(sx); // { extra: number }
withRouter(MyComponent);
let z = foo(ab); // [AB<string>, string]
// @strict: true
// @target: esnext
// Repro from #30720
export { };
