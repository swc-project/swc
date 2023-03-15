//// [objectSpreadIndexSignature.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var i = _object_spread_props(_extends({}, indexed1), {
    b: 11
});
// only indexed has indexer, so i[101]: any
i[101];
var ii = _extends({}, indexed1, indexed2);
// both have indexer, so i[1001]: number | boolean
ii[1001];
indexed3 = _extends({}, b ? indexed3 : undefined);
var writable = _extends({}, roindex);
writable.a = 0; // should be ok.
