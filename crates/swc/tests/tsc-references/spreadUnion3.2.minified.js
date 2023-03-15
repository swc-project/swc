//// [spreadUnion3.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
function g(t) {
    _extends({}, t).a;
}
_extends({
    y: 123
}, void 0), g(), g(void 0), g(null), _extends({}, nullAndUndefinedUnion, nullAndUndefinedUnion), _extends({}, nullAndUndefinedUnion);
