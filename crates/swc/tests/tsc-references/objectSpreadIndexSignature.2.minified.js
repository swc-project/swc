//// [objectSpreadIndexSignature.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
// only indexed has indexer, so i[101]: any
_object_spread_props(_object_spread({}, indexed1), {
    b: 11
})[101], // both have indexer, so i[1001]: number | boolean
_object_spread({}, indexed1, indexed2)[1001], indexed3 = _object_spread({}, b ? indexed3 : void 0), _object_spread({}, roindex).a = 0;
 // should be ok.
