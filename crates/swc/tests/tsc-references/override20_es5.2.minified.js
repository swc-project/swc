import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    var _proto = _class.prototype;
    return _proto.m1 = function() {}, _proto.m2 = function() {}, _class;
}();
export var Bar = function(Foo1) {
    "use strict";
    swcHelpers.inherits(Bar, Foo1);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        return swcHelpers.classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    var _proto = Bar.prototype;
    return _proto.m1 = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), "m1", this).call(this);
    }, _proto.m2 = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), "m2", this).call(this);
    }, Bar;
}(Foo);
