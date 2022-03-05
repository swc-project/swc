import * as swcHelpers from "@swc/helpers";
module.exports = function Obj1() {
    "use strict";
    swcHelpers.classCallCheck(this, Obj1), this.x = 12;
};
var Obj = require("./obj"), Container = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Container), this.usage = new Obj();
};
module.exports = Container;
