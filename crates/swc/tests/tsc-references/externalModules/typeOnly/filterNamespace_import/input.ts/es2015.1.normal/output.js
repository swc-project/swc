// @Filename: /ns.ts
var ns;
(function(ns1) {
    class Class {
    }
    ns1.Class = Class;
    ns1.Value = "";
    let nested1;
    (function(nested) {
        class NestedClass {
        }
        nested.NestedClass = NestedClass;
    })(nested1 || (nested1 = {
    }));
    ns1.nested = nested1;
})(ns || (ns = {
}));
ns.Class; // Error
ns.Value; // Error
let c;
let t = "";
let n = {
    a: ''
};
export { };
