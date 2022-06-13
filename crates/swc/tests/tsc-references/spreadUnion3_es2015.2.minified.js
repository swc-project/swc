import _object_spread from "@swc/helpers/src/_object_spread.mjs";
function g(t) {
    _object_spread({}, t).a;
}
_object_spread({
    y: 123
}, void 0), g(), g(void 0), g(null), _object_spread({}, nullAndUndefinedUnion, nullAndUndefinedUnion), _object_spread({}, nullAndUndefinedUnion);
