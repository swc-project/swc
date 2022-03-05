import * as swcHelpers from "@swc/helpers";
export var Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo), this.foo = "Hello";
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "slicey",
            value: function() {
                this.foo = this.foo.slice();
            }
        },
        {
            key: "m",
            value: function() {
                this.foo;
            }
        }
    ]), Foo;
}();
