//// [index.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    this.member = 10;
};
(function() {
    Foo.stat = 10;
})();
module.exports = new Foo();
module.exports.additional = 20;
