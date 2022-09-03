//// [thisTypeErrors2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Base = function Base(a) {
    "use strict";
    _class_call_check(this, Base);
}, Generic = function Generic() {
    "use strict";
    _class_call_check(this, Generic);
}, Derived = function Derived(host) {
    "use strict";
    _class_call_check(this, Derived), this.host = host, this.n = 12;
};
