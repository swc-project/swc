import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
var __ = {
    writable: true,
    value: function() {
        Foo.bar = "3";
    }()
};
console.log(Foo.bar);
console.log(new Foo().bar);
