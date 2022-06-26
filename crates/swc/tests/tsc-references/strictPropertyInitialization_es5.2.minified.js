import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _f = new WeakMap(), _g = new WeakMap(), _h = new WeakMap(), _i = new WeakMap(), C1 = function() {
    "use strict";
    _class_call_check(this, C1), _class_private_field_init(this, _f, {
        writable: !0,
        value: void 0
    }), _class_private_field_init(this, _g, {
        writable: !0,
        value: void 0
    }), _class_private_field_init(this, _h, {
        writable: !0,
        value: void 0
    }), _class_private_field_init(this, _i, {
        writable: !0,
        value: void 0
    });
}, C3 = function() {
    "use strict";
    _class_call_check(this, C3);
}, _d = new WeakMap(), _e = new WeakMap(), _f1 = new WeakMap(), C4 = function() {
    "use strict";
    _class_call_check(this, C4), this.a = 0, this.b = 0, this.c = "abc", _class_private_field_init(this, _d, {
        writable: !0,
        value: 0
    }), _class_private_field_init(this, _e, {
        writable: !0,
        value: 0
    }), _class_private_field_init(this, _f1, {
        writable: !0,
        value: "abc"
    });
}, _b = new WeakMap(), C5 = function() {
    "use strict";
    _class_call_check(this, C5), _class_private_field_init(this, _b, {
        writable: !0,
        value: void 0
    }), this.a = 0, _class_private_field_set(this, _b, 0);
}, _b1 = new WeakMap(), C6 = function(cond) {
    "use strict";
    _class_call_check(this, C6), _class_private_field_init(this, _b1, {
        writable: !0,
        value: void 0
    }), cond || (this.a = 0, _class_private_field_set(this, _b1, 0));
}, _b2 = new WeakMap(), C7 = function(cond) {
    "use strict";
    if (_class_call_check(this, C7), _class_private_field_init(this, _b2, {
        writable: !0,
        value: void 0
    }), cond) {
        this.a = 1, _class_private_field_set(this, _b2, 1);
        return;
    }
    this.a = 0, _class_private_field_set(this, _b2, 1);
}, C8 = function() {
    "use strict";
    _class_call_check(this, C8);
}, C9 = function() {
    "use strict";
    _class_call_check(this, C9);
}, _d1 = new WeakMap(), C10 = function() {
    "use strict";
    _class_call_check(this, C10), _class_private_field_init(this, _d1, {
        writable: !0,
        value: void 0
    });
    var x = this.a;
    this.a = this.b, this.b = _class_private_field_get(this, _d1), this.b = x, _class_private_field_set(this, _d1, x), this.c;
}, _b3 = new WeakMap(), C11 = function() {
    "use strict";
    _class_call_check(this, C11), _class_private_field_init(this, _b3, {
        writable: !0,
        value: void 0
    }), this.a = someValue(), _class_private_field_set(this, _b3, someValue());
};
