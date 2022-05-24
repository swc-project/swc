import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _foo = new WeakMap(), _bar = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_field_init(this, _foo, {
        writable: !0,
        value: _class_private_field_get(this, _bar)
    }), _class_private_field_init(this, _bar, {
        writable: !0,
        value: 3
    });
}, _foo1 = new WeakMap(), _bar1 = new WeakSet(), A2 = function() {
    "use strict";
    _class_call_check(this, A2), _class_private_method_init(this, _bar1), _class_private_field_init(this, _foo1, {
        writable: !0,
        value: _class_private_method_get(this, _bar1, bar).call(this)
    });
};
function bar() {
    return 3;
}
var _foo2 = new WeakMap(), _bar2 = new WeakMap(), A3 = function() {
    "use strict";
    _class_call_check(this, A3), _class_private_field_init(this, _bar2, {
        get: get_bar,
        set: void 0
    }), _class_private_field_init(this, _foo2, {
        writable: !0,
        value: _class_private_field_get(this, _bar2)
    });
};
function get_bar() {
    return 3;
}
var _foo3 = new WeakMap(), _bar3 = new WeakMap(), B = function() {
    "use strict";
    _class_call_check(this, B), _class_private_field_init(this, _foo3, {
        writable: !0,
        value: _class_private_field_get(this, _bar3)
    }), _class_private_field_init(this, _bar3, {
        writable: !0,
        value: _class_private_field_get(this, _foo3)
    });
};
