function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @Filename: /ns.ts
var ns;
(function(ns) {
    var Class = function Class() {
        "use strict";
        _classCallCheck(this, Class);
    };
    ns.Class = Class;
    ns.Value = "";
    var nested;
    (function(nested) {
        var NestedClass = function NestedClass() {
            "use strict";
            _classCallCheck(this, NestedClass);
        };
        nested.NestedClass = NestedClass;
    })(nested || (nested = {
    }));
    ns.nested = nested;
})(ns || (ns = {
}));
ns.Class; // Error
ns.Value; // Error
var c;
var t = "";
var n = {
    a: ''
};
export { };
