//// [spreadExcessProperty.ts]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var extra1 = {
    a: "a",
    b: "b",
    extra: "extra"
}, a1 = _object_spread({}, extra1);
