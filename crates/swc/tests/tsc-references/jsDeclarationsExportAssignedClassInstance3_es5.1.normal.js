import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
    this.member = 10;
};
Foo.stat = 10;
module.exports = new Foo();
module.exports.additional = 20;
