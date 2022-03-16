import * as swcHelpers from "@swc/helpers";
var nestedrest, complex, _complex, ref, _tmp, _o, ref1, o = {
    a: 1,
    b: "no"
};
swcHelpers.extends({}, o), o.a, swcHelpers.objectWithoutProperties(o, [
    "a"
]), o.a, o.b, swcHelpers.objectWithoutProperties(o, [
    "a",
    "b"
]), o.b, swcHelpers.objectWithoutProperties(o, [
    "b"
]), o.b, swcHelpers.objectWithoutProperties(o, [
    "b"
]);
var _b = o.b;
_b["0"], _b["1"], swcHelpers.objectWithoutProperties(o, [
    "b"
]);
var o2 = {
    c: "terrible idea?",
    d: "yes"
};
o2.d, swcHelpers.objectWithoutProperties(o2, [
    "d"
]), nestedrest.x;
var _n1 = nestedrest.n1;
_n1.y, _n1.n2.z, swcHelpers.extends({}, nestedrest.n1.n2.n3), swcHelpers.objectWithoutProperties(nestedrest, [
    "x",
    "n1"
]), complex.x.ka, complex.y, swcHelpers.objectWithoutProperties(complex.x, [
    "ka"
]), swcHelpers.objectWithoutProperties(complex, [
    "x",
    "y"
]), _complex = complex, swcHelpers.objectWithoutProperties(_complex.x, [
    "ka"
]), swcHelpers.objectWithoutProperties(_complex, [
    "x",
    "y"
]), (ref = _complex).x.ka, ref.y;
var _ref = {
    x: 1,
    y: 2
};
_ref.x, swcHelpers.objectWithoutProperties(_ref, [
    "x"
]), _tmp = {
    x: 1,
    y: 2
}, swcHelpers.objectWithoutProperties(_tmp, [
    "x"
]), _tmp.x;
var Removable = function() {
    "use strict";
    function Removable() {
        swcHelpers.classCallCheck(this, Removable);
    }
    return Removable.prototype.m = function() {}, swcHelpers.createClass(Removable, [
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
removable.removed, swcHelpers.objectWithoutProperties(removable, [
    "removed"
]);
var i = removable;
i.removed, swcHelpers.objectWithoutProperties(i, [
    "removed"
]);
var computed = "b", computed2 = "a", o = (o[computed], o[computed2], swcHelpers.objectWithoutProperties(o, [
    computed,
    computed2
].map(swcHelpers.toPropertyKey)));
_o = o, o = swcHelpers.objectWithoutProperties(_o, [
    computed,
    computed2
].map(swcHelpers.toPropertyKey)), (ref1 = _o)[computed], ref1[computed2];
