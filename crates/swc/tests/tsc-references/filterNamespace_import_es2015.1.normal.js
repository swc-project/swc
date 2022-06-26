// @Filename: /ns.ts
var ns;
(function(ns) {
    class Class {
    }
    ns.Class = Class;
    var Value = ns.Value = "";
    let nested;
    (function(nested) {
        class NestedClass {
        }
        nested.NestedClass = NestedClass;
    })(nested = ns.nested || (ns.nested = {}));
})(ns || (ns = {}));
export default ns;
ns.Class; // Error
ns.Value; // Error
let c;
let t = "";
let n = {
    a: ''
};
