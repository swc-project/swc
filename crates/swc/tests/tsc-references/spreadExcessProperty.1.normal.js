//// [spreadExcessProperty.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
var extra1 = {
    a: "a",
    b: "b",
    extra: "extra"
};
var a1 = _extends({}, extra1); // spread should not give excess property errors
