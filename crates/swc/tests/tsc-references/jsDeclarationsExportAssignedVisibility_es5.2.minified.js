import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
module.exports = function Obj1() {
    "use strict";
    _class_call_check(this, Obj1), this.x = 12;
};
var Obj = require("./obj"), Container = function() {
    "use strict";
    _class_call_check(this, Container), this.usage = new Obj();
};
module.exports = Container;
