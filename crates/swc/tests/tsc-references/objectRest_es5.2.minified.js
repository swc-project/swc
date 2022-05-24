import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
import _to_property_key from "@swc/helpers/lib/_to_property_key.js";
var nestedrest, complex, _complex, ref, _tmp, _o, ref1, o = {
    a: 1,
    b: "no"
};
_extends({}, o), o.a, _object_without_properties(o, [
    "a"
]), o.a, o.b, _object_without_properties(o, [
    "a",
    "b"
]), o.b, _object_without_properties(o, [
    "b"
]), o.b, _object_without_properties(o, [
    "b"
]);
var _b = o.b;
_b["0"], _b["1"], _object_without_properties(o, [
    "b"
]);
var o2 = {
    c: "terrible idea?",
    d: "yes"
};
o2.d, _object_without_properties(o2, [
    "d"
]), nestedrest.x;
var _n1 = nestedrest.n1;
_n1.y, _n1.n2.z, _extends({}, nestedrest.n1.n2.n3), _object_without_properties(nestedrest, [
    "x",
    "n1"
]), complex.x.ka, complex.y, _object_without_properties(complex.x, [
    "ka"
]), _object_without_properties(complex, [
    "x",
    "y"
]), _object_without_properties((_complex = complex).x, [
    "ka"
]), _object_without_properties(_complex, [
    "x",
    "y"
]), (ref = _complex).x.ka, ref.y;
var _ref = {
    x: 1,
    y: 2
};
_ref.x, _object_without_properties(_ref, [
    "x"
]), _object_without_properties(_tmp = {
    x: 1,
    y: 2
}, [
    "x"
]), _tmp.x;
var Removable = function() {
    "use strict";
    function Removable() {
        _class_call_check(this, Removable);
    }
    return Removable.prototype.m = function() {}, _create_class(Removable, [
        {
            key: "z",
            set: function(value) {}
        },
        {
            key: "both",
            get: function() {
                return 12;
            },
            set: function(value) {}
        }
    ]), Removable;
}(), removable = new Removable();
removable.removed, _object_without_properties(removable, [
    "removed"
]);
var i = removable;
i.removed, _object_without_properties(i, [
    "removed"
]);
var computed = "b", computed2 = "a", o = (o[computed], o[computed2], _object_without_properties(o, [
    computed,
    computed2
].map(_to_property_key)));
o = _object_without_properties(_o = o, [
    computed,
    computed2
].map(_to_property_key)), ref1 = _o, ref1[computed], ref1[computed2];
