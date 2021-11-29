// @Filename: /ns.ts
let ns;
(function(ns) {
    class Class {
    }
    ns.Class = Class;
    ns.Value = "";
    let nested;
    (function(nested) {
        class NestedClass {
        }
        nested.NestedClass = NestedClass;
    })(nested || (nested = {
    }));
    ns.nested = nested;
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
