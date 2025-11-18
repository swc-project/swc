//// [interface.ts]
export { };
//// [lib.js]
/**
 * @template T
 * @implements {IEncoder<T>}
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Encoder = /*#__PURE__*/ function() {
    "use strict";
    function Encoder() {
        _class_call_check(this, Encoder);
    }
    var _proto = Encoder.prototype;
    /**
     * @param {T} value 
     */ _proto.encode = function encode(value) {
        return new Uint8Array(0);
    };
    return Encoder;
} /**
 * @template T
 * @typedef {import('./interface').Encoder<T>} IEncoder
 */ ();
