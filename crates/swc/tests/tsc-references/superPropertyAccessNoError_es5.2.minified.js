import * as swcHelpers from "@swc/helpers";
var SomeBaseClass = function() {
    "use strict";
    function SomeBaseClass() {
        swcHelpers.classCallCheck(this, SomeBaseClass);
    }
    var _proto = SomeBaseClass.prototype;
    return _proto.func = function() {
        return "";
    }, _proto.returnThis = function() {
        return this;
    }, SomeBaseClass.func = function() {
        return 3;
    }, SomeBaseClass;
}(), SomeDerivedClass = function(SomeBaseClass) {
    "use strict";
    swcHelpers.inherits(SomeDerivedClass, SomeBaseClass);
    var _super = swcHelpers.createSuper(SomeDerivedClass);
    function SomeDerivedClass() {
        swcHelpers.classCallCheck(this, SomeDerivedClass);
        var _this = _super.call(this);
        return swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(SomeDerivedClass.prototype)), "func", _this).call(_this), _this;
    }
    var _proto = SomeDerivedClass.prototype;
    return _proto.fn = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
    }, _proto.returnThis = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "returnThis", this).call(this);
    }, SomeDerivedClass.fn = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass), "func", this).call(this);
    }, swcHelpers.createClass(SomeDerivedClass, [
        {
            key: "a",
            get: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this), null;
            },
            set: function(n) {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
            }
        }
    ], [
        {
            key: "a",
            get: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass), "func", this).call(this), null;
            },
            set: function(n) {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass), "func", this).call(this);
            }
        }
    ]), SomeDerivedClass;
}(SomeBaseClass);
new SomeDerivedClass().returnThis().fn();
