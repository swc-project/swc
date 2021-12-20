function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: obj.js
module.exports = function Obj1() {
    "use strict";
    _classCallCheck(this, Obj1);
    this.x = 12;
};
// @filename: index.js
var Obj = require("./obj");
var Container = function Container() {
    "use strict";
    _classCallCheck(this, Container);
    this.usage = new Obj();
};
module.exports = Container;
