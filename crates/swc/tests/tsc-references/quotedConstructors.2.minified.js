//// [quotedConstructors.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new function _class() {
    "use strict";
    _class_call_check(this, _class), console.log(this);
};
