//// [index.js]
export { }; // flag file as module
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
 */ 
//// [mixed.js]
/**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function doTheThing(x) {
    return {
        x: "" + x
    };
}
var ExportedThing = function ExportedThing() {
    "use strict";
    _class_call_check(this, ExportedThing);
    this.z = "ok";
};
module.exports = {
    doTheThing: doTheThing,
    ExportedThing: ExportedThing
};
var LocalThing = function LocalThing() {
    "use strict";
    _class_call_check(this, LocalThing);
    this.y = "ok";
};
