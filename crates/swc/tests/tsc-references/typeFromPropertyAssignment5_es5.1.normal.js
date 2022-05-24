import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @Filename: b.js
import MC from "./a";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// @target: es6
export default function MyClass() {};
MyClass.bar = function C() {
    "use strict";
    _class_call_check(this, C);
};
MyClass.bar;
MC.bar;
/** @type {MC.bar} */ var x;
