//// [spreadExcessProperty.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
var extra1 = {
    a: "a",
    b: "b",
    extra: "extra"
};
var a1 = _object_spread({}, extra1); // spread should not give excess property errors
