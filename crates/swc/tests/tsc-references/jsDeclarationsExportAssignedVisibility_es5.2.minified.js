import * as swcHelpers from "@swc/helpers";
module.exports = function Obj1() {
    swcHelpers.classCallCheck(this, Obj1), this.x = 12;
};
var Obj = require("./obj"), Container = function() {
    swcHelpers.classCallCheck(this, Container), this.usage = new Obj();
};
module.exports = Container;
