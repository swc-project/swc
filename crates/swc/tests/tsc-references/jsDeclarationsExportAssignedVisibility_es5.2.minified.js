import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = function Obj() {
    "use strict";
    _class_call_check(this, Obj), this.x = 12;
};
var Obj = require("./obj"), Container = function() {
    "use strict";
    _class_call_check(this, Container), this.usage = new Obj();
};
module.exports = Container;
