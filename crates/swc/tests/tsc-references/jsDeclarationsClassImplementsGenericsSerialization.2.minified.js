//// [interface.ts]
export { };
//// [lib.js]
/**
 * @template T
 * @implements {IEncoder<T>}
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Encoder = function() {
    function Encoder() {
        _class_call_check(this, Encoder);
    }
    return(/**
     * @param {T} value 
     */ Encoder.prototype.encode = function(value) {
        return new Uint8Array(0);
    }, Encoder);
} /**
 * @template T
 * @typedef {import('./interface').Encoder<T>} IEncoder
 */ ();
