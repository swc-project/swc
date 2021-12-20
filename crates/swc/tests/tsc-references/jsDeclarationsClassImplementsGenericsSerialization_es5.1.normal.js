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
// @filename: lib.js
/**
 * @template T
 * @implements {IEncoder<T>}
 */ export var Encoder = /*#__PURE__*/ function() {
    "use strict";
    function Encoder() {
        _classCallCheck(this, Encoder);
    }
    _createClass(Encoder, [
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
