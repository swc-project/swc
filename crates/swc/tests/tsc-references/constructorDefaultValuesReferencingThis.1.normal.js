//// [constructorDefaultValuesReferencingThis.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
    _class_call_check(this, D);
};
var E = function E() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
    _class_call_check(this, E);
    this.x = x;
};
