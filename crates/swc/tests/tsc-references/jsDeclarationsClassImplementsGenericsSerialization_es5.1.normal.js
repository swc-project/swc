// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: interface.ts
export { };
// @filename: lib.js
/**
 * @template T
 * @implements {IEncoder<T>}
 */ import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
