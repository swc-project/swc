//// [objectRest.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
var _ref, _ref1, _ref2, _ref3;
var o = {
    a: 1,
    b: 'no'
};
var {} = o, clone = _extends({}, o);
var { a } = o, justB = _object_without_properties(o, [
    "a"
]);
var { a, b: renamed } = o, empty = _object_without_properties(o, [
    "a",
    "b"
]);
var { ['b']: renamed } = o, justA = _object_without_properties(o, [
    'b'
]);
var { 'b': renamed } = o, justA = _object_without_properties(o, [
    'b'
]);
var { b: { '0': n, '1': oooo } } = o, justA = _object_without_properties(o, [
    "b"
]);
let o2 = {
    c: 'terrible idea?',
    d: 'yes'
};
var { d: renamed } = o2, d = _object_without_properties(o2, [
    "d"
]);
let nestedrest;
var { x, n1: _ref4 } = nestedrest, { y, n2: _ref5 } = _ref4, { z, n3: _ref6 } = _ref5, {} = _ref6, nr = _extends({}, _ref6), restrest = _object_without_properties(nestedrest, [
    "x",
    "n1"
]);
let complex;
var { x: _ref7 } = complex, { ka } = _ref7, nested = _object_without_properties(_ref7, [
    "ka"
]), { y: other } = complex, rest = _object_without_properties(complex, [
    "x",
    "y"
]);
_ref = complex, ({ x: _ref1 } = _ref), ({ ka } = _ref1), nested = _object_without_properties(_ref1, [
    "ka"
]), ({ y: other } = _ref), rest = _object_without_properties(_ref, [
    "x",
    "y"
]), _ref;
var _ref8 = {
    x: 1,
    y: 2
}, { x } = _ref8, fresh = _object_without_properties(_ref8, [
    "x"
]);
_ref2 = {
    x: 1,
    y: 2
}, ({ x } = _ref2), fresh = _object_without_properties(_ref2, [
    "x"
]), _ref2;
class Removable {
    set z(value) {}
    get both() {
        return 12;
    }
    set both(value) {}
    m() {}
}
var removable = new Removable();
var { removed } = removable, removableRest = _object_without_properties(removable, [
    "removed"
]);
var i = removable;
var { removed } = i, removableRest2 = _object_without_properties(i, [
    "removed"
]);
let computed = 'b';
let computed2 = 'a';
var { [computed]: stillNotGreat, [computed2]: soSo } = o, o = _object_without_properties(o, [
    computed,
    computed2
].map(_to_property_key));
_ref3 = o, ({ [computed]: stillNotGreat, [computed2]: soSo } = _ref3), o = _object_without_properties(_ref3, [
    computed,
    computed2
].map(_to_property_key)), _ref3;
var noContextualType = (_0)=>{
    let { aNumber = 12 } = _0, notEmptyObject = _object_without_properties(_0, [
        "aNumber"
    ]);
    return aNumber + notEmptyObject.anythingGoes;
};
