//// [spreadOverwritesProperty.ts]
// without strict null checks, none of these should be an error
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
_object_spread({
    b: 1
}, ab), _object_spread({}, ab, ab), _object_spread({
    b: 1
}, abq);
