import _object_spread from "@swc/helpers/lib/_object_spread.js";
const extra1 = {
    a: "a",
    b: "b",
    extra: "extra"
};
const a1 = _object_spread({}, extra1); // spread should not give excess property errors
