import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return Foo.prototype.banana = function(x) {}, Foo;
}();
