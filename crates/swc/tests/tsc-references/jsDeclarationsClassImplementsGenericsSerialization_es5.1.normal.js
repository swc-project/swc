import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @filename: lib.js
/**
 * @template T
 * @implements {IEncoder<T>}
 */ export var Encoder = /*#__PURE__*/ function() {
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
