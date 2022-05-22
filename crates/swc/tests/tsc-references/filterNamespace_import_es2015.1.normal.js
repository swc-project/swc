// @Filename: /ns.ts
var ns;
(function(ns1) {
    class Class {
    }
    ns1.Class = Class;
    var Value = ns1.Value = "";
    let nested1;
    (function(nested) {
        class NestedClass {
        }
        nested.NestedClass = NestedClass;
    })(nested1 = ns1.nested || (ns1.nested = {}));
})(ns || (ns = {}));
export default ns;
ns.Class; // Error
ns.Value; // Error
let c;
let t = "";
let n = {
    a: ''
};
