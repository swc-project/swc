//// [superPropertyAccessNoError.ts]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
new (/*#__PURE__*/ function(SomeBaseClass) {
    function SomeDerivedClass() {
        var _this;
        return _class_call_check(this, SomeDerivedClass), _get((_assert_this_initialized(_this = _call_super(this, SomeDerivedClass)), _get_prototype_of(SomeDerivedClass.prototype)), "func", _this).call(_this), _this;
    }
    _inherits(SomeDerivedClass, SomeBaseClass);
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
}(/*#__PURE__*/ function() {
    function SomeBaseClass() {
        _class_call_check(this, SomeBaseClass);
    }
    var _proto = SomeBaseClass.prototype;
    return _proto.func = function() {
        return '';
    }, _proto.returnThis = function() {
        return this;
    }, SomeBaseClass.func = function() {
        return 3;
    }, SomeBaseClass;
}()))().returnThis().fn();
