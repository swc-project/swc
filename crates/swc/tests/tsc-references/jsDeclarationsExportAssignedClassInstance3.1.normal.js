//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    this.member = 10;
};
Foo.stat = 10;
module.exports = new Foo();
module.exports.additional = 20;
