//// [objectRest.ts]
let nestedrest, complex;
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
var _ref4, _ref6, o = {
    a: 1,
    b: 'no'
}, {} = o;
_extends({}, o);
var { a } = o;
_object_without_properties(o, [
    "a"
]);
var { a, b: renamed } = o;
_object_without_properties(o, [
    "a",
    "b"
]);
var { b: renamed } = o, justA = _object_without_properties(o, [
    'b'
]), { b: renamed } = o, justA = _object_without_properties(o, [
    'b'
]), { b: { 0: n, 1: oooo } } = o, justA = _object_without_properties(o, [
    "b"
]);
let o2 = {
    c: 'terrible idea?',
    d: 'yes'
};
var { d: renamed } = o2;
_object_without_properties(o2, [
    "d"
]);
var { x, n1: _ref } = nestedrest, { y, n2: _ref1 } = _ref, { z, n3: _ref2 } = _ref1, {} = _ref2;
_extends({}, _ref2), _object_without_properties(nestedrest, [
    "x",
    "n1"
]);
var { x: _ref3 } = complex, { ka } = _ref3, { y: other } = (_object_without_properties(_ref3, [
    "ka"
]), complex);
_object_without_properties(complex, [
    "x",
    "y"
]), ({ x: _ref4 } = complex), ({ ka } = _ref4), _object_without_properties(_ref4, [
    "ka"
]), ({ y: other } = complex), _object_without_properties(complex, [
    "x",
    "y"
]);
var _ref5 = {
    x: 1,
    y: 2
}, { x } = _ref5;
_object_without_properties(_ref5, [
    "x"
]), _ref6 = {
    x: 1,
    y: 2
}, ({ x } = _ref6), _object_without_properties(_ref6, [
    "x"
]);
var removable = new class {
    set z(value) {}
    get both() {
        return 12;
    }
    set both(value) {}
    m() {}
}(), { removed } = removable;
_object_without_properties(removable, [
    "removed"
]);
var { removed } = removable;
_object_without_properties(removable, [
    "removed"
]);
var { b: stillNotGreat, a: soSo } = o, o = _object_without_properties(o, [
    'b',
    'a'
].map(_to_property_key));
({ b: stillNotGreat, a: soSo } = o), o = _object_without_properties(o, [
    'b',
    'a'
].map(_to_property_key));
