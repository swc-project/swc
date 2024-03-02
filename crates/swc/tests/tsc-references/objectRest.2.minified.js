//// [objectRest.ts]
let nestedrest, complex;
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
var _tmp, _o, o = {
    a: 1,
    b: 'no'
};
_extends({}, _object_destructuring_empty(o));
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
var { x, n1: { y, n2: { z } } } = nestedrest;
_extends({}, _object_destructuring_empty(nestedrest.n1.n2.n3)), _object_without_properties(nestedrest, [
    "x",
    "n1"
]);
var { x: { ka }, y: other } = complex;
_object_without_properties(complex.x, [
    "ka"
]), _object_without_properties(complex, [
    "x",
    "y"
]), _object_without_properties(complex.x, [
    "ka"
]), _object_without_properties(complex, [
    "x",
    "y"
]), { x: { ka }, y: other } = complex;
var _ref = {
    x: 1,
    y: 2
}, { x } = _ref;
_object_without_properties(_ref, [
    "x"
]), _object_without_properties(_tmp = {
    x: 1,
    y: 2
}, [
    "x"
]), { x } = _tmp;
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
o = _object_without_properties(_o = o, [
    'b',
    'a'
].map(_to_property_key)), { b: stillNotGreat, a: soSo } = _o;
