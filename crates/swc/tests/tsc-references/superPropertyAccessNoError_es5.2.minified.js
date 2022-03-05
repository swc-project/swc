import * as swcHelpers from "@swc/helpers";
var SomeBaseClass = function() {
    "use strict";
    function SomeBaseClass() {
        swcHelpers.classCallCheck(this, SomeBaseClass);
    }
    return swcHelpers.createClass(SomeBaseClass, [
        {
            key: "func",
            value: function() {
                return "";
            }
        },
        {
            key: "returnThis",
            value: function() {
                return this;
            }
        }
    ], [
        {
            key: "func",
            value: function() {
                return 3;
            }
        }
    ]), SomeBaseClass;
}(), SomeDerivedClass = function(SomeBaseClass) {
    "use strict";
    swcHelpers.inherits(SomeDerivedClass, SomeBaseClass);
    var _super = swcHelpers.createSuper(SomeDerivedClass);
    function SomeDerivedClass() {
        swcHelpers.classCallCheck(this, SomeDerivedClass);
        var _this = _super.call(this);
        return swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(SomeDerivedClass.prototype)), "func", _this).call(_this), _this;
    }
    return swcHelpers.createClass(SomeDerivedClass, [
        {
            key: "fn",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
            }
        },
        {
            key: "a",
            get: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this), null;
            },
            set: function(n) {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
            }
        },
        {
            key: "returnThis",
            value: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "returnThis", this).call(this);
            }
        }
    ], [
        {
            key: "fn",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass), "func", this).call(this);
            }
        },
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
