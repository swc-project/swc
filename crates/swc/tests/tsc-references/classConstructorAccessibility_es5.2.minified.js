import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Generic, C = function C(x) {
    "use strict";
    _class_call_check(this, C), this.x = x;
}, D = function D(x) {
    "use strict";
    _class_call_check(this, D), this.x = x;
}, E = function E(x) {
    "use strict";
    _class_call_check(this, E), this.x = x;
};
new C(1), new D(1), new E(1), function(Generic) {
    var C = function C(x) {
        "use strict";
        _class_call_check(this, C), this.x = x;
    }, D = function D(x) {
        "use strict";
        _class_call_check(this, D), this.x = x;
    }, E = function E(x) {
        "use strict";
        _class_call_check(this, E), this.x = x;
    };
    new C(1), new D(1), new E(1);
}(Generic || (Generic = {}));
