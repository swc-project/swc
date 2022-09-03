//// [objectSpreadStrictNull.ts]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
function f(definiteBoolean, definiteString, optionalString, optionalNumber, undefinedString, undefinedNumber) {
    _object_spread({}, definiteBoolean, definiteString, optionalNumber), _object_spread({}, definiteBoolean, definiteString, optionalString, optionalNumber), _object_spread({}, optionalString, optionalNumber), _object_spread({}, definiteBoolean, definiteString, undefinedNumber), _object_spread({}, definiteBoolean, definiteString, undefinedString, undefinedNumber), _object_spread({}, undefinedString, undefinedNumber), _object_spread({}, definiteBoolean, undefinedString, optionalNumber);
}
var m = {
    title: "The Matrix",
    yearReleased: 1999
}, x = _object_spread_props(_object_spread({}, m), {
    title: void 0
});
function g(fields, partialFields, nearlyPartialFields) {
    fields = _object_spread({}, fields, partialFields), fields = _object_spread({}, fields, nearlyPartialFields);
}
