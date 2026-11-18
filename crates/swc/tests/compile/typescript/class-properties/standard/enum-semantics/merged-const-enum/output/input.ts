var Unknown = /*#__PURE__*/ function(Unknown) {
    Unknown[Unknown["A"] = 5] = "A";
    return Unknown;
}(Unknown || {});
(function(Unknown) {
    Unknown[Unknown["B"] = runtime()] = "B";
})(Unknown);
var ReverseUnknown = function(ReverseUnknown) {
    ReverseUnknown[ReverseUnknown["A"] = runtime()] = "A";
    return ReverseUnknown;
}(ReverseUnknown || {});
(function(ReverseUnknown) {
    ReverseUnknown[ReverseUnknown["B"] = 7] = "B";
})(ReverseUnknown);
function runtime() {
    return 6;
}
var ObjectUse = /*#__PURE__*/ function(ObjectUse) {
    ObjectUse[ObjectUse["A"] = 8] = "A";
    return ObjectUse;
}(ObjectUse || {});
(function(ObjectUse) {
    ObjectUse[ObjectUse["B"] = 9] = "B";
})(ObjectUse);
const object = ObjectUse;
var Writes = /*#__PURE__*/ function(Writes) {
    Writes[Writes["A"] = 10] = "A";
    return Writes;
}(Writes || {});
(function(Writes) {
    Writes[Writes["B"] = 11] = "B";
})(Writes);
Writes.B = 12;
const observed = [
    1,
    2,
    3,
    4,
    5,
    Unknown.B,
    ReverseUnknown.A,
    7
];
