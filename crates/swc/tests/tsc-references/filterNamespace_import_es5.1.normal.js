import * as swcHelpers from "@swc/helpers";
// @Filename: /ns.ts
var ns;
(function(ns1) {
    var Class = function Class() {
        "use strict";
        swcHelpers.classCallCheck(this, Class);
    };
    ns1.Class = Class;
    var Value = ns1.Value = "";
    var nested1;
    (function(nested) {
        var NestedClass = function NestedClass() {
            "use strict";
            swcHelpers.classCallCheck(this, NestedClass);
        };
        nested.NestedClass = NestedClass;
    })(nested1 = ns1.nested || (ns1.nested = {}));
})(ns || (ns = {}));
export default ns;
ns.Class; // Error
ns.Value; // Error
var c;
var t = "";
var n = {
    a: ""
};
