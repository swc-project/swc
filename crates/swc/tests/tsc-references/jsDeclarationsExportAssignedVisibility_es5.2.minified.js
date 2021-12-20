function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
module.exports = function Obj1() {
    "use strict";
    _classCallCheck(this, Obj1), this.x = 12;
};
var Obj = require("./obj"), Container = function() {
    "use strict";
    _classCallCheck(this, Container), this.usage = new Obj();
};
module.exports = Container;
