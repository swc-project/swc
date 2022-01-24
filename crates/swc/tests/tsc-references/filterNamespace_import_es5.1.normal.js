function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @Filename: /ns.ts
var ns;
(function(ns1) {
    var Class = function Class() {
        "use strict";
        _classCallCheck(this, Class);
    };
    ns1.Class = Class;
    var Value = ns1.Value = "";
    var nested1;
    (function(nested) {
        var NestedClass = function NestedClass() {
            "use strict";
            _classCallCheck(this, NestedClass);
        };
        nested.NestedClass = NestedClass;
    })(nested1 = ns1.nested || (ns1.nested = {}));
})(ns || (ns = {}));
ns.Class; // Error
ns.Value; // Error
var c;
var t = "";
var n = {
    a: ''
};
export { };
