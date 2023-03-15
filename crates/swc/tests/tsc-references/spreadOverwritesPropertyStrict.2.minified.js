//// [spreadOverwritesPropertyStrict.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
_extends({
    b: 1
}, ab), _extends({}, ab, ab), _extends({
    b: 1
}, abq), _object_spread_props(_extends({}, ab), {
    b: 1
}), _object_spread_props(_extends({}, abq), {
    b: 1
});
