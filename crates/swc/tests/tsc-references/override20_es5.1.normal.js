import * as swcHelpers from "@swc/helpers";
// @target: esnext
// @noImplicitOverride: true
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    swcHelpers.createClass(_class, [
        {
            key: "m1",
            value: function m1() {}
        },
        {
            key: "m2",
            value: function m2() {}
        }
    ]);
    return _class;
}();
export var Bar = /*#__PURE__*/ function(Foo1) {
    "use strict";
    swcHelpers.inherits(Bar, Foo1);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Bar, [
        {
            key: "m1",
            value: function m1() {
                swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), "m1", this).call(this);
            }
        },
        {
            key: "m2",
            value: function m2() {
                swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), "m2", this).call(this);
            }
        }
    ]);
    return Bar;
}(Foo);
