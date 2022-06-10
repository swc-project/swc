import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo), this.member = 10;
};
Foo.stat = 10, module.exports = new Foo(), module.exports.additional = 20;
