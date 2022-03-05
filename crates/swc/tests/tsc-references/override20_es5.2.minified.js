import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return swcHelpers.createClass(_class, [
        {
            key: "m1",
            value: function() {}
        },
        {
            key: "m2",
            value: function() {}
        }
    ]), _class;
}();
export var Bar = function(Foo1) {
    "use strict";
    swcHelpers.inherits(Bar, Foo1);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        return swcHelpers.classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Bar, [
        {
            key: "m1",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), "m1", this).call(this);
            }
        },
        {
            key: "m2",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), "m2", this).call(this);
            }
        }
    ]), Bar;
}(Foo);
