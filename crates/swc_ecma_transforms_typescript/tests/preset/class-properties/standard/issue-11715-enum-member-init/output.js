var Str = /*#__PURE__*/ function(Str) {
    Str["A"] = "a";
    return Str;
}(Str || {});
const fromStr = "a";
var FromEnumMemberStr = /*#__PURE__*/ function(FromEnumMemberStr) {
    FromEnumMemberStr["X"] = "a";
    FromEnumMemberStr["Y"] = "y";
    return FromEnumMemberStr;
}(FromEnumMemberStr || {});
var Num = /*#__PURE__*/ function(Num) {
    Num[Num["A"] = 1] = "A";
    return Num;
}(Num || {});
const fromNum = 1;
var FromEnumMemberNum = /*#__PURE__*/ function(FromEnumMemberNum) {
    FromEnumMemberNum[FromEnumMemberNum["X"] = 1] = "X";
    FromEnumMemberNum[FromEnumMemberNum["Y"] = 2] = "Y";
    return FromEnumMemberNum;
}(FromEnumMemberNum || {});
