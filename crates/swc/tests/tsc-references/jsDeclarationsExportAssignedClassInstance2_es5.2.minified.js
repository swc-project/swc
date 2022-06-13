import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo), this.member = 10;
};
Foo.stat = 10, module.exports = new Foo();
