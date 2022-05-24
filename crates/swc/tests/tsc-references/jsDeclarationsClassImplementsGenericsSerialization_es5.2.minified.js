import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
export var Encoder = function() {
    "use strict";
    function Encoder() {
        _class_call_check(this, Encoder);
    }
    return Encoder.prototype.encode = function(value) {
        return new Uint8Array(0);
    }, Encoder;
}();
