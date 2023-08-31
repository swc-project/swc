//// [spreadOverwritesPropertyStrict.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
_object_spread({
    b: 1
}, ab) // error
, _object_spread({}, ab, ab) // ok, overwritten error doesn't apply to spreads
, _object_spread({
    b: 1
}, abq) // ok, abq might have b: undefined
, _object_spread_props(_object_spread({}, ab), {
    b: 1
}) // ok, we don't care that b in ab is overwritten
, _object_spread_props(_object_spread({}, abq), {
    b: 1
}) // ok
;
