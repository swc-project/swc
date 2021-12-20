function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    // @allowJs: true
    // @checkJs: true
    // @target: es5
    // @outDir: ./out
    // @declaration: true
    // @filename: index.js
    this.member = new Q();
};
var Q = function Q() {
    "use strict";
    _classCallCheck(this, Q);
    this.x = 42;
};
module.exports = function Q() {
    "use strict";
    _classCallCheck(this, Q);
    this.x = new A();
};
module.exports.Another = Q;
