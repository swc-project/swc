//// [typeOfThisInStaticMembers10.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var __ = new WeakMap(), __2 = new WeakMap(), __1 = new WeakMap(), __21 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), __5 = new WeakMap(), __6 = new WeakMap(), __22 = new WeakMap(), __7 = new WeakMap(), __23 = new WeakMap(), __31 = new WeakMap(), __41 = new WeakMap(), __51 = new WeakMap();
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C = _ts_decorate([
    foo
], C);
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    D.foo = function foo1() {
        return this.c + 1;
    };
    _create_class(D, null, [
        {
            key: "fa",
            get: function get() {
                return this.c + 1;
            },
            set: function set(v) {
                this.c = v + 1;
            }
        }
    ]);
    return D;
}(C);
D = _ts_decorate([
    foo
], D);
var CC = function CC() {
    "use strict";
    _class_call_check(this, CC);
};
var DD = /*#__PURE__*/ function(CC) {
    "use strict";
    _inherits(DD, CC);
    function DD() {
        _class_call_check(this, DD);
        return _call_super(this, DD, arguments);
    }
    DD.foo = function foo1() {
        return this.c + 1;
    };
    _create_class(DD, null, [
        {
            key: "fa",
            get: function get() {
                return this.c + 1;
            },
            set: function set(v) {
                this.c = v + 1;
            }
        }
    ]);
    return DD;
}(CC);
__7.set(DD, {
    writable: true,
    value: DD.c = 2
});
__23.set(DD, {
    writable: true,
    value: DD.d = DD.c + 1
});
__31.set(DD, {
    writable: true,
    value: DD.e = super.a + DD.c + 1
});
__41.set(DD, {
    writable: true,
    value: DD.f = function() {
        return DD.c + 1;
    }
});
__51.set(DD, {
    writable: true,
    value: DD.ff = function() {
        this.c + 1;
    }
});
