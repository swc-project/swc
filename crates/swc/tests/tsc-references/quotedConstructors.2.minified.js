//// [quotedConstructors.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function E() {
        _class_call_check(this, E);
    }
    return E.prototype.constructor = function() {
        console.log(this);
    }, E;
}(), new function _class() {
    "use strict";
    _class_call_check(this, _class), console.log(this);
};
