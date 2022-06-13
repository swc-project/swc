import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
_object_spread({
    b: 1
}, ab), _object_spread({}, ab, ab), _object_spread({
    b: 1
}, abq), _object_spread_props(_object_spread({}, ab), {
    b: 1
}), _object_spread_props(_object_spread({}, abq), {
    b: 1
});
