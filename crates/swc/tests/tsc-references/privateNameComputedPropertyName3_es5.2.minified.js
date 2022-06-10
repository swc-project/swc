import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
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
