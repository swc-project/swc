import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _name = new WeakMap(), Foo = function() {
    "use strict";
    function Foo(name) {
        _class_call_check(this, Foo), _class_private_field_init(this, _name, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _name, name);
    }
    return Foo.prototype.getValue = function(x) {
        var _y = new WeakMap(), tmp = _class_private_field_get(this, _name), Bar = function() {
            function Bar() {
                _class_call_check(this, Bar), _class_private_field_init(this, _y, {
                    writable: !0,
                    value: 100
                });
            }
            return Bar.prototype[tmp] = function() {
                return x + _class_private_field_get(this, _y);
            }, Bar;
        }();
        return new Bar()[_class_private_field_get(this, _name)]();
    }, Foo;
}();
console.log(new Foo("NAME").getValue(100));
