import * as swcHelpers from "@swc/helpers";
var CharacterInfo = function() {
    "use strict";
    function CharacterInfo() {
        swcHelpers.classCallCheck(this, CharacterInfo);
    }
    return CharacterInfo.isDecimalDigit = function(c) {
        return c >= CharacterCodes._0 && c <= CharacterCodes._9;
    }, CharacterInfo.isHexDigit = function(c) {
        return isDecimalDigit(c) || c >= CharacterCodes.A && c <= CharacterCodes.F || c >= CharacterCodes.a && c <= CharacterCodes.f;
    }, CharacterInfo.hexValue = function(c) {
        return Debug.assert(isHexDigit(c)), isDecimalDigit(c) ? c - CharacterCodes._0 : c >= CharacterCodes.A && c <= CharacterCodes.F ? c - CharacterCodes.A + 10 : c - CharacterCodes.a + 10;
    }, CharacterInfo;
}();
