import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @pretty: true
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: mod1.js
/** @typedef {number} Foo */ var Bar = function Bar() {
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
