var Source = /*#__PURE__*/ function(Source) {
    Source[Source["A"] = 1] = "A";
    return Source;
}(Source || {});
Source.A = 5;
const cached = Source.A;
var Dest = /*#__PURE__*/ function(Dest) {
    Dest[Dest["B"] = 1] = "B";
    Dest[Dest["C"] = 2] = "C";
    Dest[Dest["D"] = 1] = "D";
    return Dest;
}(Dest || {});
(function(Aliases) {
    Aliases.SourceAlias = Source;
})(Aliases || (Aliases = {}));
var ViaAlias = /*#__PURE__*/ function(ViaAlias) {
    ViaAlias[ViaAlias["A"] = 1] = "A";
    return ViaAlias;
}(ViaAlias || {});
const dependent = 1;
var FromDependent = /*#__PURE__*/ function(FromDependent) {
    FromDependent[FromDependent["A"] = 2] = "A";
    FromDependent[FromDependent["B"] = 3] = "B";
    return FromDependent;
}(FromDependent || {});
var FromConstEnum = /*#__PURE__*/ function(FromConstEnum) {
    FromConstEnum[FromConstEnum["A"] = 7] = "A";
    FromConstEnum[FromConstEnum["B"] = 8] = "B";
    return FromConstEnum;
}(FromConstEnum || {});
const folded = 7;
var TextSource = /*#__PURE__*/ function(TextSource) {
    TextSource["A"] = "before";
    return TextSource;
}(TextSource || {});
TextSource.A = 1;
var TextDest = function(TextDest) {
    TextDest["A"] = "before";
    TextDest[TextDest["B"] = TextSource.A] = "B";
    TextDest[TextDest["C"] = void 0] = "C";
    return TextDest;
}(TextDest || {});
var Aliases;
