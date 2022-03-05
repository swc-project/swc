import * as swcHelpers from "@swc/helpers";
var CharacterInfo = function() {
    "use strict";
    function CharacterInfo() {
        swcHelpers.classCallCheck(this, CharacterInfo);
    }
    return swcHelpers.createClass(CharacterInfo, null, [
        {
            key: "isDecimalDigit",
            value: function(c) {
                return c >= CharacterCodes._0 && c <= CharacterCodes._9;
            }
        },
        {
            key: "isHexDigit",
            value: function(c) {
                return isDecimalDigit(c) || c >= CharacterCodes.A && c <= CharacterCodes.F || c >= CharacterCodes.a && c <= CharacterCodes.f;
            }
        },
        {
            key: "hexValue",
            value: function(c) {
                return Debug.assert(isHexDigit(c)), isDecimalDigit(c) ? c - CharacterCodes._0 : c >= CharacterCodes.A && c <= CharacterCodes.F ? c - CharacterCodes.A + 10 : c - CharacterCodes.a + 10;
            }
        }
    ]), CharacterInfo;
}();
