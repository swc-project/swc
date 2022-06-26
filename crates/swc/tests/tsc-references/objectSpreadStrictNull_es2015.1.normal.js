import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
// @strictNullChecks: true
function f(definiteBoolean, definiteString, optionalString, optionalNumber, undefinedString, undefinedNumber) {
    // optional
    let optionalUnionStops = _object_spread({}, definiteBoolean, definiteString, optionalNumber);
    let optionalUnionDuplicates = _object_spread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    let allOptional = _object_spread({}, optionalString, optionalNumber);
    // undefined
    let undefinedUnionStops = _object_spread({}, definiteBoolean, definiteString, undefinedNumber);
    let undefinedUnionDuplicates = _object_spread({}, definiteBoolean, definiteString, undefinedString, undefinedNumber);
    let allUndefined = _object_spread({}, undefinedString, undefinedNumber);
    let undefinedWithOptionalContinues = _object_spread({}, definiteBoolean, undefinedString, optionalNumber);
}
const m = {
    title: "The Matrix",
    yearReleased: 1999
};
// should error here because title: undefined is not assignable to string
const x = _object_spread_props(_object_spread({}, m), {
    title: undefined
});
function g(fields, partialFields, nearlyPartialFields) {
    // ok, undefined is stripped from optional properties when spread
    fields = _object_spread({}, fields, partialFields);
    // error: not optional, undefined remains
    fields = _object_spread({}, fields, nearlyPartialFields);
}
