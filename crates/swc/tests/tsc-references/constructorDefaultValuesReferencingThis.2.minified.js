//// [constructorDefaultValuesReferencingThis.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], _class_call_check(this, C);
}, D = function D() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], _class_call_check(this, D);
}, E = function E() {
    "use strict";
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this;
    _class_call_check(this, E), this.x = x;
};
