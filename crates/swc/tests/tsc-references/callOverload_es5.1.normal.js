import * as swcHelpers from "@swc/helpers";
var n;
fn(1) // no error
;
fn(1, 2, 3, 4);
takeTwo(1, 2, 3, 4);
withRest.apply(void 0, [
    "a"
].concat(swcHelpers.toConsumableArray(n))); // no error
withRest();
withRest.apply(void 0, swcHelpers.toConsumableArray(n));
