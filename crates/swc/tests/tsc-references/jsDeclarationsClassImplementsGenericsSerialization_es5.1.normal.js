import * as swcHelpers from "@swc/helpers";
// @filename: lib.js
/**
 * @template T
 * @implements {IEncoder<T>}
 */ export var Encoder = /*#__PURE__*/ function() {
    "use strict";
    function Encoder() {
        swcHelpers.classCallCheck(this, Encoder);
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
