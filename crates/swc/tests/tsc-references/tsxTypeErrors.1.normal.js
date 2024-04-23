//// [tsxTypeErrors.tsx]
// A built-in element (OK)
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var a1 = /*#__PURE__*/ React.createElement("div", {
    id: "foo"
});
// A built-in element with a mistyped property (error)
var a2 = /*#__PURE__*/ React.createElement("img", {
    srce: "foo.jpg"
});
// A built-in element with a badly-typed attribute value (error)
var thing = {
    oops: 100
};
var a3 = /*#__PURE__*/ React.createElement("div", {
    id: thing
});
// Mistyped html name (error)
var e1 = /*#__PURE__*/ React.createElement("imag", {
    src: "bar.jpg"
});
// A custom type
var MyClass = function MyClass() {
    "use strict";
    _class_call_check(this, MyClass);
};
// Let's use it
// TODO: Error on missing 'reqd'
var b1 = /*#__PURE__*/ React.createElement(MyClass, {
    reqd: true
});
// Mistyped attribute member
// sample.tsx(23,22): error TS2322: Type '{ x: number; y: string; }' is not assignable to type '{ x: number; y: number; }'.
//  Types of property 'y' are incompatible.
//    Type 'string' is not assignable to type 'number'.
var b2 = /*#__PURE__*/ React.createElement(MyClass, {
    pt: {
        x: 4,
        y: 'oops'
    }
});
