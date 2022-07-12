// @allowJs: true
// @noEmit: true
// @checkJs: true
// @Filename: file1.js
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var SomeClass = function SomeClass() {
    this.otherProp = 0;
};
new SomeClass();
// @Filename: file2.js
var SomeClass = function SomeClass() {
    "use strict";
    _class_call_check(this, SomeClass);
};
SomeClass.prop = 0;
