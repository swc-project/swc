//// [typeFromPropertyAssignment35.ts]
//// [bug26877.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function ollKorrect(x) {
    x._model, new Emu.D(), Emu.D._wrapperInstance;
}
Emu.D = function _class() {
    "use strict";
    _class_call_check(this, _class), this._model = 1;
};
//// [second.js]
var Emu = {};
Emu.D._wrapperInstance;
