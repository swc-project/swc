import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
const { x  } = _object_spread_props(_object_spread({}, {}), {
    x: 0
});
const { y  } = _object_spread({
    y: 0
}, {});
const { z , a , b  } = _object_spread({
    z: 0
}, {
    a: 0,
    b: 0
});
const { c , d , e , f , g  } = _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, {
    c: 0
}), {
    d: 0
})), {
    e: 0
})), {
    f: 0
});
