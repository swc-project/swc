//// [destructuringVariableDeclaration1ES5.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var _ref = {
    a1: 10,
    a2: "world"
};
_ref.a1, _ref.a2;
var tmp = {
    b11: "world"
};
(void 0 === tmp ? {
    b11: "string"
} : tmp).b11;
var _ref1 = [
    void 0,
    void 0,
    void 0
];
_ref1[0], _ref1[1], _ref1[2];
var _concat = _sliced_to_array([
    1,
    "string"
].concat(_to_consumable_array([
    !0,
    !1,
    !0
])), 2);
_concat[0], _concat[1];
var _ref_e = _sliced_to_array([
    1,
    2,
    {
        b1: 4,
        b4: 0
    }
], 3);
_ref_e[0], _ref_e[1], _ref_e[2];
var _ref_f = _sliced_to_array([
    1,
    2,
    {
        f3: 4,
        f5: 0
    }
], 3), _ref_f_ = (_ref_f[0], _ref_f[1], _ref_f[2]);
_ref_f_.f3, _ref_f_.f5;
