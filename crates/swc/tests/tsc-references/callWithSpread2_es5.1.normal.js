import * as swcHelpers from "@swc/helpers";
// good
all.apply(void 0, swcHelpers.toConsumableArray(ns));
weird.apply(void 0, swcHelpers.toConsumableArray(ns));
weird.apply(void 0, swcHelpers.toConsumableArray(mixed));
weird.apply(void 0, swcHelpers.toConsumableArray(tuple));
prefix.apply(void 0, [
    "a"
].concat(swcHelpers.toConsumableArray(ns)));
rest.apply(void 0, [
    "d"
].concat(swcHelpers.toConsumableArray(ns)));
// extra arguments
normal.apply(void 0, [
    "g"
].concat(swcHelpers.toConsumableArray(ns)));
thunk.apply(void 0, swcHelpers.toConsumableArray(ns));
// bad
all.apply(void 0, swcHelpers.toConsumableArray(mixed));
all.apply(void 0, swcHelpers.toConsumableArray(tuple));
prefix.apply(void 0, [
    "b"
].concat(swcHelpers.toConsumableArray(mixed)));
prefix.apply(void 0, [
    "c"
].concat(swcHelpers.toConsumableArray(tuple)));
rest.apply(void 0, [
    "e"
].concat(swcHelpers.toConsumableArray(mixed)));
rest.apply(void 0, [
    "f"
].concat(swcHelpers.toConsumableArray(tuple)));
prefix.apply(void 0, swcHelpers.toConsumableArray(ns)) // required parameters are required
;
prefix.apply(void 0, swcHelpers.toConsumableArray(mixed));
prefix.apply(void 0, swcHelpers.toConsumableArray(tuple));
prefix2.apply(void 0, [
    "g"
].concat(swcHelpers.toConsumableArray(ns)));
