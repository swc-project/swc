var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 1] = "A";
    return E;
}(E || {});
const direct = E?.A;
var FromDirect = /*#__PURE__*/ function(FromDirect) {
    FromDirect[FromDirect["X"] = 1] = "X";
    FromDirect[FromDirect["Y"] = 2] = "Y";
    return FromDirect;
}(FromDirect || {});
const computed = E?.["A"];
var FromComputed = /*#__PURE__*/ function(FromComputed) {
    FromComputed[FromComputed["X"] = 1] = "X";
    FromComputed[FromComputed["Y"] = 2] = "Y";
    return FromComputed;
}(FromComputed || {});
const nested = E?.A?.valueOf;
var FromNested = function(FromNested) {
    FromNested[FromNested["X"] = nested] = "X";
    FromNested[FromNested["Y"] = void 0] = "Y";
    return FromNested;
}(FromNested || {});
var InMember = /*#__PURE__*/ function(InMember) {
    InMember[InMember["X"] = 1] = "X";
    InMember[InMember["Y"] = 2] = "Y";
    return InMember;
}(InMember || {});
const obj = {
    foo: 1
};
var NotEnum = function(NotEnum) {
    NotEnum[NotEnum["X"] = obj?.foo] = "X";
    return NotEnum;
}(NotEnum || {});
