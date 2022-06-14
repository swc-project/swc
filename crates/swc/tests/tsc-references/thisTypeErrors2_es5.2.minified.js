import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Base = function(a) {
    "use strict";
    _class_call_check(this, Base);
}, Generic = function() {
    "use strict";
    _class_call_check(this, Generic);
}, Derived = function(host) {
    "use strict";
    _class_call_check(this, Derived), this.host = host, this.n = 12;
};
