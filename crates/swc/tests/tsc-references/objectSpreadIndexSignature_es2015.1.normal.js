import * as swcHelpers from "@swc/helpers";
let i = swcHelpers.objectSpread({}, indexed1, {
    b: 11
});
// only indexed has indexer, so i[101]: any
i[101];
let ii = swcHelpers.objectSpread({}, indexed1, indexed2);
// both have indexer, so i[1001]: number | boolean
ii[1001];
indexed3 = swcHelpers.objectSpread({}, b ? indexed3 : undefined);
var writable = swcHelpers.objectSpread({}, roindex);
writable.a = 0; // should be ok.
