import * as swcHelpers from "@swc/helpers";
var CharacterInfo = ///<reference path='References.ts' />
/*#__PURE__*/ function() {
    "use strict";
    function CharacterInfo() {
        swcHelpers.classCallCheck(this, CharacterInfo);
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
