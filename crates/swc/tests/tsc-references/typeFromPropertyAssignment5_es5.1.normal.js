import * as swcHelpers from "@swc/helpers";
// @Filename: b.js
import MC from './a';
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// @target: es6
export default function MyClass() {};
MyClass.bar = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
MyClass.bar;
MC.bar;
/** @type {MC.bar} */ var x;
