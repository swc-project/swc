import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_spread_props from "@swc/helpers/lib/_object_spread_props.js";
// fixes #12200
function f() {
    let n = 12;
    let m = 13;
    let a = null;
    const o1 = _object_spread_props(_object_spread({}, {}), {
        [n]: n
    });
    const o2 = _object_spread_props(_object_spread({}, {}), {
        [a]: n
    });
    const o3 = _object_spread_props(_object_spread(_object_spread_props(_object_spread({
        [a]: n
    }, {}), {
        [n]: n
    }), {}), {
        [m]: m
    });
}
