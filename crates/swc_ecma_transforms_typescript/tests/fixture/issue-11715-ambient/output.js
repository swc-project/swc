var AmbientConstNum = /*#__PURE__*/ function(AmbientConstNum) {
    AmbientConstNum[AmbientConstNum["A"] = 1] = "A";
    AmbientConstNum[AmbientConstNum["B"] = 2] = "B";
    return AmbientConstNum;
}(AmbientConstNum || {});
var AmbientConstStr = /*#__PURE__*/ function(AmbientConstStr) {
    AmbientConstStr["A"] = "v";
    return AmbientConstStr;
}(AmbientConstStr || {});
const viaConst = Ambient.X;
var ViaConst = /*#__PURE__*/ function(ViaConst) {
    ViaConst[ViaConst["P"] = 1] = "P";
    ViaConst[ViaConst["Q"] = 2] = "Q";
    return ViaConst;
}(ViaConst || {});
var Direct = /*#__PURE__*/ function(Direct) {
    Direct[Direct["P"] = 2] = "P";
    Direct[Direct["Q"] = 3] = "Q";
    return Direct;
}(Direct || {});
const stillRuntime = Ambient.NoInit;
var StaysRuntime = function(StaysRuntime) {
    StaysRuntime[StaysRuntime["P"] = stillRuntime] = "P";
    StaysRuntime[StaysRuntime["Q"] = void 0] = "Q";
    return StaysRuntime;
}(StaysRuntime || {});
console.log(Ambient.X);
const fromConstEnum = AmbientConst.Z;
var FromAmbientConstEnum = /*#__PURE__*/ function(FromAmbientConstEnum) {
    FromAmbientConstEnum[FromAmbientConstEnum["P"] = 6] = "P";
    FromAmbientConstEnum[FromAmbientConstEnum["Q"] = 7] = "Q";
    return FromAmbientConstEnum;
}(FromAmbientConstEnum || {});
var Concrete = /*#__PURE__*/ function(Concrete) {
    Concrete[Concrete["K"] = 40] = "K";
    return Concrete;
}(Concrete || {});
var ResultChain = /*#__PURE__*/ function(ResultChain) {
    ResultChain[ResultChain["A"] = 42] = "A";
    ResultChain[ResultChain["B"] = 43] = "B";
    return ResultChain;
}(ResultChain || {});
var Merged = /*#__PURE__*/ function(Merged) {
    Merged[Merged["X"] = 1] = "X";
    return Merged;
}(Merged || {});
var FromMerged = /*#__PURE__*/ function(FromMerged) {
    FromMerged[FromMerged["P"] = 5] = "P";
    FromMerged[FromMerged["Q"] = 6] = "Q";
    return FromMerged;
}(FromMerged || {});
console.log(Merged.Y);
const seed = 1;
var ChainBack = /*#__PURE__*/ function(ChainBack) {
    ChainBack[ChainBack["P"] = 1] = "P";
    ChainBack[ChainBack["Q"] = 2] = "Q";
    return ChainBack;
}(ChainBack || {});
var AssertedRead = function(AssertedRead) {
    AssertedRead[AssertedRead["A"] = AmbientAsserted.X] = "A";
    AssertedRead[AssertedRead["B"] = void 0] = "B";
    return AssertedRead;
}(AssertedRead || {});
const assertedVia = AmbientAsserted.X;
var AssertedViaConst = function(AssertedViaConst) {
    AssertedViaConst[AssertedViaConst["A"] = assertedVia] = "A";
    AssertedViaConst[AssertedViaConst["B"] = void 0] = "B";
    return AssertedViaConst;
}(AssertedViaConst || {});
const viaAssertedSibling = AssertedSibling.Y;
var FromAssertedSibling = function(FromAssertedSibling) {
    FromAssertedSibling[FromAssertedSibling["P"] = viaAssertedSibling] = "P";
    FromAssertedSibling[FromAssertedSibling["Q"] = void 0] = "Q";
    return FromAssertedSibling;
}(FromAssertedSibling || {});
var FromAssertedInit = function(FromAssertedInit) {
    FromAssertedInit[FromAssertedInit["Y"] = AssertedInit.X] = "Y";
    FromAssertedInit[FromAssertedInit["Z"] = void 0] = "Z";
    return FromAssertedInit;
}(FromAssertedInit || {});
