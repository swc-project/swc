import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_spread_props from "@swc/helpers/lib/_object_spread_props.js";
_object_spread({
    b: 1
}, ab), _object_spread({}, ab, ab), _object_spread({
    b: 1
}, abq), _object_spread_props(_object_spread({}, ab), {
    b: 1
}), _object_spread_props(_object_spread({}, abq), {
    b: 1
});
