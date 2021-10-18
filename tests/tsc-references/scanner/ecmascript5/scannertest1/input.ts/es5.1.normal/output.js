function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var CharacterInfo = ///<reference path='References.ts' />
/*#__PURE__*/ function() {
    "use strict";
    function CharacterInfo() {
        _classCallCheck(this, CharacterInfo);
    }
    _createClass(CharacterInfo, null, [
        {
            key: "isDecimalDigit",
            value: function isDecimalDigit(c) {
                return c >= CharacterCodes._0 && c <= CharacterCodes._9;
            }
        },
        {
            key: "isHexDigit",
            value: function isHexDigit(c) {
                return isDecimalDigit(c) || c >= CharacterCodes.A && c <= CharacterCodes.F || c >= CharacterCodes.a && c <= CharacterCodes.f;
            }
        },
        {
            key: "hexValue",
            value: function hexValue(c) {
                Debug.assert(isHexDigit(c));
                return isDecimalDigit(c) ? c - CharacterCodes._0 : c >= CharacterCodes.A && c <= CharacterCodes.F ? c - CharacterCodes.A + 10 : c - CharacterCodes.a + 10;
            }
        }
    ]);
    return CharacterInfo;
}();
