import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Base = function Base(a) {
    "use strict";
    _class_call_check(this, Base);
};
var Generic = function Generic() {
    "use strict";
    _class_call_check(this, Generic);
};
var Derived = function Derived(host) {
    "use strict";
    _class_call_check(this, Derived);
    this.host = host;
    var self = this;
    this.n = 12;
};
