//// [typeFromPropertyAssignment35.ts]
//// [bug26877.js]
/** @param {Emu.D} x */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Emu.D = function _class() {
    _class_call_check(this, _class), this._model = 1;
};
//// [second.js]
/** @type {string} */ ({}).D._wrapperInstance;
