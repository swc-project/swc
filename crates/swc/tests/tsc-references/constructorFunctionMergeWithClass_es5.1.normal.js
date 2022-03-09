import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @noEmit: true
// @checkJs: true
// @Filename: file1.js
var SomeClass = function SomeClass() {
    this.otherProp = 0;
};
new SomeClass();
// @Filename: file2.js
var SomeClass = function SomeClass() {
    "use strict";
    swcHelpers.classCallCheck(this, SomeClass);
};
SomeClass.prop = 0;
