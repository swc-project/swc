// @Filename: /ns.ts
var ns1;
(function(ns) {
    class Class {
    }
    ns.Class = Class;
    ns.Value = "";
    var nested1;
    (function(nested) {
        class NestedClass {
        }
        nested.NestedClass = NestedClass;
    })(nested1 || (nested1 = {
    }));
    ns.nested = nested1;
})(ns1 || (ns1 = {
}));
ns1.Class; // Error
ns1.Value; // Error
let c;
let t = "";
let n = {
    a: ''
};
export { };
