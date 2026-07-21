var DuplicateMembers = /*#__PURE__*/ function(DuplicateMembers) {
    DuplicateMembers[DuplicateMembers["A"] = 1] = "A";
    DuplicateMembers[DuplicateMembers["A"] = 5] = "A";
    DuplicateMembers[DuplicateMembers["B"] = 6] = "B";
    DuplicateMembers[DuplicateMembers["C"] = 2] = "C";
    return DuplicateMembers;
}(DuplicateMembers || {});
var MergedMembers = /*#__PURE__*/ function(MergedMembers) {
    MergedMembers[MergedMembers["A"] = 1] = "A";
    return MergedMembers;
}(MergedMembers || {});
(function(MergedMembers) {
    MergedMembers[MergedMembers["B"] = 2] = "B";
    MergedMembers[MergedMembers["C"] = 3] = "C";
})(MergedMembers);
var ForwardReference = /*#__PURE__*/ function(ForwardReference) {
    ForwardReference[ForwardReference["A"] = 1] = "A";
    ForwardReference[ForwardReference["Later"] = 1] = "Later";
    return ForwardReference;
}(ForwardReference || {});
var QualifiedForwardReference = /*#__PURE__*/ function(QualifiedForwardReference) {
    QualifiedForwardReference[QualifiedForwardReference["A"] = 1] = "A";
    QualifiedForwardReference[QualifiedForwardReference["Later"] = 1] = "Later";
    return QualifiedForwardReference;
}(QualifiedForwardReference || {});
var SelfReference = function(SelfReference) {
    SelfReference[SelfReference["A"] = SelfReference.A] = "A";
    SelfReference[SelfReference["B"] = SelfReference.B] = "B";
    return SelfReference;
}(SelfReference || {});
var OpaqueMembers = function(OpaqueMembers) {
    OpaqueMembers[OpaqueMembers["A"] = getValue()] = "A";
    OpaqueMembers[OpaqueMembers["B"] = OpaqueMembers.A] = "B";
    OpaqueMembers[OpaqueMembers["C"] = OpaqueMembers.A] = "C";
    return OpaqueMembers;
}(OpaqueMembers || {});
var ShadowedGlobals = /*#__PURE__*/ function(ShadowedGlobals) {
    ShadowedGlobals[ShadowedGlobals["Positive"] = 0] = "Positive";
    ShadowedGlobals[ShadowedGlobals["Infinity"] = 1] = "Infinity";
    ShadowedGlobals[ShadowedGlobals["NotANumber"] = 0] = "NotANumber";
    ShadowedGlobals[ShadowedGlobals["NaN"] = 2] = "NaN";
    return ShadowedGlobals;
}(ShadowedGlobals || {});
var Globals = /*#__PURE__*/ function(Globals) {
    Globals[Globals["Positive"] = Infinity] = "Positive";
    Globals[Globals["NotANumber"] = NaN] = "NotANumber";
    return Globals;
}(Globals || {});
