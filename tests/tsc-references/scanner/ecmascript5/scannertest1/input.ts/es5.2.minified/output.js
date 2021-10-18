var CharacterInfo = function() {
    "use strict";
    var Constructor;
    function CharacterInfo() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, CharacterInfo);
    }
    return (function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    })(Constructor = CharacterInfo, [
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
