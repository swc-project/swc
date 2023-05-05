//// [typeFromPropertyAssignment35.ts]
//// [bug26877.js]
/** @param {Emu.D} x */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function ollKorrect(x) {
    x._model;
    var y = new Emu.D();
    var z = Emu.D._wrapperInstance;
}
Emu.D = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this._model = 1;
};
//// [second.js]
var Emu = {};
/** @type {string} */ Emu.D._wrapperInstance;
