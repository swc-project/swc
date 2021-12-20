function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
    // @allowJs: true
    // @checkJs: true
    // @target: es5
    // @outDir: ./out
    // @declaration: true
    // @filename: index.js
    this.member = 10;
};
Foo.stat = 10;
module.exports = new Foo();
