import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @Filename: /ns.ts
var ns;
(function(ns) {
    var Class = function Class() {
        "use strict";
        _class_call_check(this, Class);
    };
    ns.Class = Class;
    var Value = ns.Value = "";
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
ns.Class; // Error
ns.Value; // Error
var c;
var t = "";
var n = {
    a: ""
};
