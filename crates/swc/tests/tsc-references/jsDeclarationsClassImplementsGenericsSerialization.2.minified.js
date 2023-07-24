//// [interface.ts]
export { };
//// [lib.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Encoder = function() {
    function Encoder() {
        _class_call_check(this, Encoder);
    }
    return Encoder.prototype.encode = function(value) {
        return new Uint8Array(0);
    }, Encoder;
}();
