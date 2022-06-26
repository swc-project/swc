import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
// @strictNullChecks: true
function f(definiteBoolean, definiteString, optionalString, optionalNumber, undefinedString, undefinedNumber) {
    // optional
    var optionalUnionStops = _object_spread({}, definiteBoolean, definiteString, optionalNumber);
    var optionalUnionDuplicates = _object_spread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    var allOptional = _object_spread({}, optionalString, optionalNumber);
    // undefined
    var undefinedUnionStops = _object_spread({}, definiteBoolean, definiteString, undefinedNumber);
    var undefinedUnionDuplicates = _object_spread({}, definiteBoolean, definiteString, undefinedString, undefinedNumber);
    var allUndefined = _object_spread({}, undefinedString, undefinedNumber);
    var undefinedWithOptionalContinues = _object_spread({}, definiteBoolean, undefinedString, optionalNumber);
}
var m = {
    title: "The Matrix",
    yearReleased: 1999
};
// should error here because title: undefined is not assignable to string
var x = _object_spread_props(_object_spread({}, m), {
    title: undefined
});
function g(fields, partialFields, nearlyPartialFields) {
    // ok, undefined is stripped from optional properties when spread
    fields = _object_spread({}, fields, partialFields);
    // error: not optional, undefined remains
    fields = _object_spread({}, fields, nearlyPartialFields);
}
