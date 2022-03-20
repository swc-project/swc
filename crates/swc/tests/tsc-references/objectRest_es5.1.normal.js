import * as swcHelpers from "@swc/helpers";
// @target: es2015
var o = {
    a: 1,
    b: "no"
};
var clone = swcHelpers.extends({}, o);
var a = o.a, justB = swcHelpers.objectWithoutProperties(o, [
    "a"
]);
var a = o.a, renamed = o.b, empty = swcHelpers.objectWithoutProperties(o, [
    "a",
    "b"
]);
var renamed = o["b"], justA = swcHelpers.objectWithoutProperties(o, [
    "b"
]);
var renamed = o["b"], justA = swcHelpers.objectWithoutProperties(o, [
    "b"
]);
var _b = o.b, n = _b["0"], oooo = _b["1"], justA = swcHelpers.objectWithoutProperties(o, [
    "b"
]);
var o2 = {
    c: "terrible idea?",
    d: "yes"
};
var renamed = o2.d, d = swcHelpers.objectWithoutProperties(o2, [
    "d"
]);
var nestedrest;
var x = nestedrest.x, _n1 = nestedrest.n1, y = _n1.y, z = _n1.n2.z, nr = swcHelpers.extends({}, nestedrest.n1.n2.n3), restrest = swcHelpers.objectWithoutProperties(nestedrest, [
    "x",
    "n1"
]);
var complex;
var ka = complex.x.ka, other = complex.y, nested = swcHelpers.objectWithoutProperties(complex.x, [
    "ka"
]), rest = swcHelpers.objectWithoutProperties(complex, [
    "x",
    "y"
]);
var _complex;
var ref;
_complex = complex, nested = swcHelpers.objectWithoutProperties(_complex.x, [
    "ka"
]), rest = swcHelpers.objectWithoutProperties(_complex, [
    "x",
    "y"
]), ref = _complex, ka = ref.x.ka, other = ref.y, ref, _complex;
var _ref = {
    x: 1,
    y: 2
}, x = _ref.x, fresh = swcHelpers.objectWithoutProperties(_ref, [
    "x"
]);
var _tmp;
_tmp = {
    x: 1,
    y: 2
}, fresh = swcHelpers.objectWithoutProperties(_tmp, [
    "x"
]), x = _tmp.x, _tmp;
var Removable = /*#__PURE__*/ function() {
    "use strict";
    function Removable() {
        swcHelpers.classCallCheck(this, Removable);
    }
    var _proto = Removable.prototype;
    _proto.m = function m() {};
    swcHelpers.createClass(Removable, [
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
var removed = removable.removed, removableRest = swcHelpers.objectWithoutProperties(removable, [
    "removed"
]);
var i = removable;
var removed = i.removed, removableRest2 = swcHelpers.objectWithoutProperties(i, [
    "removed"
]);
var computed = "b";
var computed2 = "a";
var stillNotGreat = o[computed], soSo = o[computed2], o = swcHelpers.objectWithoutProperties(o, [
    computed,
    computed2
].map(swcHelpers.toPropertyKey));
var _o;
var ref1;
_o = o, o = swcHelpers.objectWithoutProperties(_o, [
    computed,
    computed2
].map(swcHelpers.toPropertyKey)), ref1 = _o, stillNotGreat = ref1[computed], soSo = ref1[computed2], ref1, _o;
var noContextualType = function(_param) {
    var _aNumber = _param.aNumber, aNumber = _aNumber === void 0 ? 12 : _aNumber, notEmptyObject = swcHelpers.objectWithoutProperties(_param, [
        "aNumber"
    ]);
    return aNumber + notEmptyObject.anythingGoes;
};
