//// [objectRest.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
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
var { x, n1: { y, n2: { z, n3: _ref } } } = nestedrest, {} = _ref, nr = _extends({}, _ref), restrest = _object_without_properties(nestedrest, [
    "x",
    "n1"
]);
let complex;
var { x: _ref1, y: other } = complex, { ka } = _ref1, nested = _object_without_properties(_ref1, [
    "ka"
]), rest = _object_without_properties(complex, [
    "x",
    "y"
]);
({ x: _ref2, y: other } = complex), ({ ka } = _ref2), nested = _object_without_properties(_ref2, [
    "ka"
]), rest = _object_without_properties(complex, [
    "x",
    "y"
]), complex;
var _ref2;
var _ref3 = {
    x: 1,
    y: 2
}, { x } = _ref3, fresh = _object_without_properties(_ref3, [
    "x"
]);
_ref4 = {
    x: 1,
    y: 2
}, ({ x } = _ref4), fresh = _object_without_properties(_ref4, [
    "x"
]), _ref4;
var _ref4;
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
({ [computed]: stillNotGreat, [computed2]: soSo } = o), o = _object_without_properties(o, [
    computed,
    computed2
].map(_to_property_key)), o;
var noContextualType = (_0)=>{
    let { aNumber = 12 } = _0, notEmptyObject = _object_without_properties(_0, [
        "aNumber"
    ]);
    return aNumber + notEmptyObject.anythingGoes;
};
