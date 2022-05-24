import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
///<reference path='References.ts' />
var CharacterInfo = /*#__PURE__*/ function() {
    "use strict";
    function CharacterInfo() {
        _class_call_check(this, CharacterInfo);
    }
    CharacterInfo.isDecimalDigit = function isDecimalDigit(c) {
        return c >= CharacterCodes._0 && c <= CharacterCodes._9;
    };
    CharacterInfo.isHexDigit = function isHexDigit(c) {
        return isDecimalDigit(c) || c >= CharacterCodes.A && c <= CharacterCodes.F || c >= CharacterCodes.a && c <= CharacterCodes.f;
    };
    CharacterInfo.hexValue = function hexValue(c) {
        Debug.assert(isHexDigit(c));
        return isDecimalDigit(c) ? c - CharacterCodes._0 : c >= CharacterCodes.A && c <= CharacterCodes.F ? c - CharacterCodes.A + 10 : c - CharacterCodes.a + 10;
    };
    return CharacterInfo;
}();
