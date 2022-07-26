// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// @target: es6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export default function MyClass() {};
MyClass.bar = function C() {
    "use strict";
    _class_call_check(this, C);
};
MyClass.bar;
// @Filename: b.js
import MC from "./a";
MC.bar;
/** @type {MC.bar} */ var x;
