import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
// good
all.apply(void 0, _to_consumable_array(ns));
weird.apply(void 0, _to_consumable_array(ns));
weird.apply(void 0, _to_consumable_array(mixed));
weird.apply(void 0, _to_consumable_array(tuple));
prefix.apply(void 0, [
    "a"
].concat(_to_consumable_array(ns)));
rest.apply(void 0, [
    "d"
].concat(_to_consumable_array(ns)));
// extra arguments
normal.apply(void 0, [
    "g"
].concat(_to_consumable_array(ns)));
thunk.apply(void 0, _to_consumable_array(ns));
// bad
all.apply(void 0, _to_consumable_array(mixed));
all.apply(void 0, _to_consumable_array(tuple));
prefix.apply(void 0, [
    "b"
].concat(_to_consumable_array(mixed)));
prefix.apply(void 0, [
    "c"
].concat(_to_consumable_array(tuple)));
rest.apply(void 0, [
    "e"
].concat(_to_consumable_array(mixed)));
rest.apply(void 0, [
    "f"
].concat(_to_consumable_array(tuple)));
prefix.apply(void 0, _to_consumable_array(ns)) // required parameters are required
;
prefix.apply(void 0, _to_consumable_array(mixed));
prefix.apply(void 0, _to_consumable_array(tuple));
prefix2.apply(void 0, [
    "g"
].concat(_to_consumable_array(ns)));
