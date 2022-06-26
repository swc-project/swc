import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B), this.hello = 10, this[0b110] = "world", this[0o23534] = "WORLD", this[20] = "twenty";
    }
    var _proto = B.prototype;
    return _proto.foo = function() {}, _proto[0b1110] = function() {}, _proto[11] = function() {}, _proto.interface = function() {}, B;
}();
B.hi = 10000, B[22] = "twenty-two", B[0b101] = "binary", B[0o3235] = "octal";
