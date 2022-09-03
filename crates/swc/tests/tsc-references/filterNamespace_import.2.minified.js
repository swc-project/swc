//// [/ns.ts]
var ns;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(ns) {
    var nested, NestedClass, Class = function Class() {
        "use strict";
        _class_call_check(this, Class);
    };
    ns.Class = Class, ns.Value = "", nested = ns.nested || (ns.nested = {}), NestedClass = function NestedClass() {
        "use strict";
        _class_call_check(this, NestedClass);
    }, nested.NestedClass = NestedClass;
}(ns || (ns = {}));
export default ns;
//// [/a.ts]
ns.Class, ns.Value;
var c, t = "", n = {
    a: ""
};
export { };
