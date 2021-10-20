function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @Filename: /ns.ts
var ns1;
(function(ns) {
    var Class = function Class() {
        "use strict";
        _classCallCheck(this, Class);
    };
    ns.Class = Class;
    ns.Value = "";
    var nested1;
    (function(nested) {
        var NestedClass = function NestedClass() {
            "use strict";
            _classCallCheck(this, NestedClass);
        };
        nested.NestedClass = NestedClass;
    })(nested1 || (nested1 = {
    }));
    ns.nested = nested1;
})(ns1 || (ns1 = {
}));
ns1.Class; // Error
ns1.Value; // Error
var c;
var t = "";
var n = {
    a: ''
};
export { };
