//// [index.js]
export { };
 // flag file as module
 /**
 * @typedef {string | number | symbol} PropName 
 */  /**
 * Callback
 *
 * @callback NumberToStringCb
 * @param {number} a
 * @returns {string}
 */  /**
 * @template T
 * @typedef {T & {name: string}} MixinName 
 */  /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ //// [mixed.js]
/**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = {
    doTheThing: function(x) {
        return {
            x: "" + x
        };
    },
    ExportedThing: function ExportedThing() {
        _class_call_check(this, ExportedThing), this.z = "ok";
    }
};
