//// [spreadOverwritesPropertyStrict.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
_object_spread({
    b: 1
}, ab), _object_spread({}, ab, ab), _object_spread({
    b: 1
}, abq), _object_spread_props(_object_spread({}, ab), {
    b: 1
}), _object_spread_props(_object_spread({}, abq), {
    b: 1
});
