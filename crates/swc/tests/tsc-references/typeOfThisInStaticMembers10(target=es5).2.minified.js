//// [typeOfThisInStaticMembers10.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap();
var __7 = new WeakMap(), __23 = new WeakMap(), __31 = new WeakMap(), __41 = new WeakMap(), __51 = new WeakMap(), C = function C() {
    _class_call_check(this, C);
}, D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D.foo = function() {
        return this.c + 1;
    }, _create_class(D, null, [
        {
            key: "fa",
            get: function() {
                return this.c + 1;
            },
            set: function(v) {
                this.c = v + 1;
            }
        }
    ]), D;
}(C = _ts_decorate([
    foo
], C));
D = _ts_decorate([
    foo
], D);
var DD = /*#__PURE__*/ function(CC) {
    function DD() {
        return _class_call_check(this, DD), _call_super(this, DD, arguments);
    }
    return _inherits(DD, CC), DD.foo = function() {
        return this.c + 1;
    }, _create_class(DD, null, [
        {
            key: "fa",
            get: function() {
                return this.c + 1;
            },
            set: function(v) {
                this.c = v + 1;
            }
        }
    ]), DD;
}(function CC() {
    _class_call_check(this, CC);
});
__7.set(DD, {
    writable: !0,
    value: DD.c = 2
}), __23.set(DD, {
    writable: !0,
    value: DD.d = DD.c + 1
}), __31.set(DD, {
    writable: !0,
    value: DD.e = super.a + DD.c + 1
}), __41.set(DD, {
    writable: !0,
    value: DD.f = function() {
        return DD.c + 1;
    }
}), __51.set(DD, {
    writable: !0,
    value: DD.ff = function() {
        this.c;
    }
});
