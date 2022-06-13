import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _name = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022, es2015
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo(name) {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _name, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _name, name);
    }
    var _proto1 = Foo.prototype;
    _proto1.getValue = function getValue(x) {
        var obj = this;
        var _y = /*#__PURE__*/ new WeakMap();
        var tmp = _class_private_field_get(obj, _name);
        var Bar = /*#__PURE__*/ function() {
            function Bar() {
                _class_call_check(this, Bar);
                _class_private_field_init(this, _y, {
                    writable: true,
                    value: 100
                });
            }
            var _proto = Bar.prototype;
            _proto[tmp] = function() {
                return x + _class_private_field_get(this, _y);
            };
            return Bar;
        }();
        return new Bar()[_class_private_field_get(obj, _name)]();
    };
    return Foo;
}();
console.log(new Foo("NAME").getValue(100));
