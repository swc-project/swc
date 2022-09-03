//// [initializerReferencingConstructorParameters.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C(x1) {
    "use strict";
    _class_call_check(this, C), this.a = x;
}, D = function D(x1) {
    "use strict";
    _class_call_check(this, D), this.x = x1, this.a = x;
}, E = function E(x1) {
    "use strict";
    _class_call_check(this, E), this.x = x1, this.a = this.x;
}, F = function F(x1) {
    "use strict";
    _class_call_check(this, F), this.x = x1, this.a = this.x, this.b = x;
};
