import _assert_this_initialized from "@swc/helpers/lib/_assert_this_initialized.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var SomeBaseClass = function() {
    "use strict";
    function SomeBaseClass() {
        _class_call_check(this, SomeBaseClass);
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
    _inherits(SomeDerivedClass, SomeBaseClass);
    var _super = _create_super(SomeDerivedClass);
    function SomeDerivedClass() {
        _class_call_check(this, SomeDerivedClass);
        var _this = _super.call(this);
        return _get((_assert_this_initialized(_this), _get_prototype_of(SomeDerivedClass.prototype)), "func", _this).call(_this), _this;
    }
    var _proto = SomeDerivedClass.prototype;
    return _proto.fn = function() {
        _get(_get_prototype_of(SomeDerivedClass.prototype), "func", this).call(this);
    }, _proto.returnThis = function() {
        return _get(_get_prototype_of(SomeDerivedClass.prototype), "returnThis", this).call(this);
    }, SomeDerivedClass.fn = function() {
        _get(_get_prototype_of(SomeDerivedClass), "func", this).call(this);
    }, _create_class(SomeDerivedClass, [
        {
            key: "a",
            get: function() {
                return _get(_get_prototype_of(SomeDerivedClass.prototype), "func", this).call(this), null;
            },
            set: function(n) {
                _get(_get_prototype_of(SomeDerivedClass.prototype), "func", this).call(this);
            }
        }
    ], [
        {
            key: "a",
            get: function() {
                return _get(_get_prototype_of(SomeDerivedClass), "func", this).call(this), null;
            },
            set: function(n) {
                _get(_get_prototype_of(SomeDerivedClass), "func", this).call(this);
            }
        }
    ]), SomeDerivedClass;
}(SomeBaseClass);
new SomeDerivedClass().returnThis().fn();
