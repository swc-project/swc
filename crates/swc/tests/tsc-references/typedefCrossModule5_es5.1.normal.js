// @pretty: true
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: mod1.js
/** @typedef {number} Foo */ import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
// @Filename: mod2.js
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
} // should error
;
var Bar = 3;
