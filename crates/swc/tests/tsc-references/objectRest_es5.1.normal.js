import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _to_property_key from "@swc/helpers/src/_to_property_key.mjs";
// @target: es2015
var o = {
    a: 1,
    b: "no"
};
var clone = _extends({}, o);
var a = o.a, justB = _object_without_properties(o, [
    "a"
]);
var a = o.a, renamed = o.b, empty = _object_without_properties(o, [
    "a",
    "b"
]);
var renamed = o["b"], justA = _object_without_properties(o, [
    "b"
]);
var renamed = o["b"], justA = _object_without_properties(o, [
    "b"
]);
var _b = o.b, n = _b["0"], oooo = _b["1"], justA = _object_without_properties(o, [
    "b"
]);
var o2 = {
    c: "terrible idea?",
    d: "yes"
};
var renamed = o2.d, d = _object_without_properties(o2, [
    "d"
]);
var nestedrest;
var x = nestedrest.x, _n1 = nestedrest.n1, y = _n1.y, z = _n1.n2.z, nr = _extends({}, nestedrest.n1.n2.n3), restrest = _object_without_properties(nestedrest, [
    "x",
    "n1"
]);
var complex;
var ka = complex.x.ka, other = complex.y, nested = _object_without_properties(complex.x, [
    "ka"
]), rest = _object_without_properties(complex, [
    "x",
    "y"
]);
var _complex;
var ref;
_complex = complex, nested = _object_without_properties(_complex.x, [
    "ka"
]), rest = _object_without_properties(_complex, [
    "x",
    "y"
]), ref = _complex, ka = ref.x.ka, other = ref.y, ref, _complex;
var _ref = {
    x: 1,
    y: 2
}, x = _ref.x, fresh = _object_without_properties(_ref, [
    "x"
]);
var _tmp;
_tmp = {
    x: 1,
    y: 2
}, fresh = _object_without_properties(_tmp, [
    "x"
]), x = _tmp.x, _tmp;
var Removable = /*#__PURE__*/ function() {
    "use strict";
    function Removable() {
        _class_call_check(this, Removable);
    }
    var _proto = Removable.prototype;
    _proto.m = function m() {};
    _create_class(Removable, [
        {
            key: "z",
            set: function set(value) {}
        },
        {
            key: "both",
            get: function get() {
                return 12;
            },
            set: function set(value) {}
        }
    ]);
    return Removable;
}();
var removable = new Removable();
var removed = removable.removed, removableRest = _object_without_properties(removable, [
    "removed"
]);
var i = removable;
var removed = i.removed, removableRest2 = _object_without_properties(i, [
    "removed"
]);
var computed = "b";
var computed2 = "a";
var stillNotGreat = o[computed], soSo = o[computed2], o = _object_without_properties(o, [
    computed,
    computed2
].map(_to_property_key));
var _o;
var ref1;
_o = o, o = _object_without_properties(_o, [
    computed,
    computed2
].map(_to_property_key)), ref1 = _o, stillNotGreat = ref1[computed], soSo = ref1[computed2], ref1, _o;
var noContextualType = function(_param) {
    var _aNumber = _param.aNumber, aNumber = _aNumber === void 0 ? 12 : _aNumber, notEmptyObject = _object_without_properties(_param, [
        "aNumber"
    ]);
    return aNumber + notEmptyObject.anythingGoes;
};
