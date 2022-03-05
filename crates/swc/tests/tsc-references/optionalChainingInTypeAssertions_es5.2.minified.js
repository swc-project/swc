import * as swcHelpers from "@swc/helpers";
var ref, ref1, ref2, ref3, Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "m",
            value: function() {}
        }
    ]), Foo;
}(), foo = new Foo();
null === (ref = foo.m) || void 0 === ref || ref(), null === (ref1 = foo.m) || void 0 === ref1 || ref1(), null === (ref2 = foo.m) || void 0 === ref2 || ref2(), null === (ref3 = foo.m) || void 0 === ref3 || ref3();
