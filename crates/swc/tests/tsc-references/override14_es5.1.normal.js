import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
    this.property = 1;
};
var SubFoo = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(SubFoo, Foo);
    var _super = swcHelpers.createSuper(SubFoo);
    function SubFoo() {
        swcHelpers.classCallCheck(this, SubFoo);
        return _super.apply(this, arguments);
    }
    return SubFoo;
}(Foo);
