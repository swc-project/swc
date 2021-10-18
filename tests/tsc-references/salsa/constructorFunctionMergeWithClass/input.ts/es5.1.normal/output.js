function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @allowJs: true
// @noEmit: true
// @checkJs: true
// @Filename: file1.js
var SomeClass = function SomeClass() {
    this.otherProp = 0;
};
new SomeClass();
var SomeClass = function SomeClass() {
    "use strict";
    _classCallCheck(this, SomeClass);
};
SomeClass.prop = 0;
