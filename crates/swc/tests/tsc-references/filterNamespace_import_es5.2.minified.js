var ns;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(ns) {
    var nested, NestedClass, Class = function() {
        "use strict";
        _class_call_check(this, Class);
    };
    ns.Class = Class, ns.Value = "", nested = ns.nested || (ns.nested = {}), NestedClass = function() {
        "use strict";
        _class_call_check(this, NestedClass);
    }, nested.NestedClass = NestedClass;
}(ns || (ns = {}));
export default ns;
ns.Class, ns.Value;
