import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Generic, C = function(x) {
    "use strict";
    _class_call_check(this, C), this.x = x;
}, D = function(x) {
    "use strict";
    _class_call_check(this, D), this.x = x;
}, E = function(x) {
    "use strict";
    _class_call_check(this, E), this.x = x;
};
new C(1), new D(1), new E(1), function(Generic) {
    var C1 = function(x) {
        "use strict";
        _class_call_check(this, C1), this.x = x;
    }, D1 = function(x) {
        "use strict";
        _class_call_check(this, D1), this.x = x;
    }, E1 = function(x) {
        "use strict";
        _class_call_check(this, E1), this.x = x;
    };
    new C1(1), new D1(1), new E1(1);
}(Generic || (Generic = {}));
