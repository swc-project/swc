//// [/ns.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var ns;
(function(ns) {
    var Class = function Class() {
        "use strict";
        _class_call_check(this, Class);
    };
    ns.Class = Class;
    ns.Value = "";
    var nested;
    (function(nested) {
        var NestedClass = function NestedClass() {
            "use strict";
            _class_call_check(this, NestedClass);
        };
        nested.NestedClass = NestedClass;
    })(nested = ns.nested || (ns.nested = {}));
})(ns || (ns = {}));
export default ns;
//// [/a.ts]
ns.Class; // Error
ns.Value; // Error
var c;
var t = "";
var n = {
    a: ""
};
export { };
