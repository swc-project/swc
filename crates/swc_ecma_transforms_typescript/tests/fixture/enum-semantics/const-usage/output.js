const folded = 2;
var ObjectUse = /*#__PURE__*/ function(ObjectUse) {
    ObjectUse[ObjectUse["A"] = 3] = "A";
    ObjectUse[ObjectUse["B"] = 4] = "B";
    return ObjectUse;
}(ObjectUse || {});
const object = ObjectUse;
var Optional = /*#__PURE__*/ function(Optional) {
    Optional[Optional["A"] = 5] = "A";
    Optional[Optional["B"] = 6] = "B";
    return Optional;
}(Optional || {});
const optional = Optional?.A;
var Dynamic = /*#__PURE__*/ function(Dynamic) {
    Dynamic[Dynamic["A"] = 6] = "A";
    Dynamic[Dynamic["B"] = 7] = "B";
    return Dynamic;
}(Dynamic || {});
const key = "A";
const dynamic = Dynamic[key];
var Writes = /*#__PURE__*/ function(Writes) {
    Writes[Writes["A"] = 7] = "A";
    Writes[Writes["B"] = 8] = "B";
    return Writes;
}(Writes || {});
({ value: Writes.A } = {
    value: 9
});
for (Writes.B of [
    10
]){}
var Mixed = function(Mixed) {
    Mixed[Mixed["A"] = 11] = "A";
    Mixed[Mixed["B"] = runtime()] = "B";
    return Mixed;
}(Mixed || {});
function runtime() {
    return 12;
}
const mixed = Mixed;
var Merged = /*#__PURE__*/ function(Merged) {
    Merged[Merged["A"] = 13] = "A";
    return Merged;
}(Merged || {});
(function(Merged) {
    Merged[Merged["B"] = 14] = "B";
})(Merged);
const merged = [
    13,
    14
];
