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
    swcHelpers.createClass(Encoder, [
        {
            /**
     * @param {T} value 
     */ key: "encode",
            value: function encode(value) {
                return new Uint8Array(0);
            }
        }
    ]);
    return Encoder;
} /**
 * @template T
 * @typedef {import('./interface').Encoder<T>} IEncoder
 */ ();
