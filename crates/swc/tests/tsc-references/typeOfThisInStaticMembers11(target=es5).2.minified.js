//// [typeOfThisInStaticMembers11.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var C = function C() {
    _class_call_check(this, C);
}, D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), _create_class(D, null, [
        {
            key: "foo",
            value: function() {
                return this.c + 1;
            }
        },
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
    return _inherits(DD, CC), _create_class(DD, null, [
        {
            key: "foo",
            value: function() {
                return this.c + 1;
            }
        },
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
_define_property(DD, "c", 2), _define_property(DD, "d", DD.c + 1), _define_property(DD, "e", super.a + DD.c + 1), _define_property(DD, "f", function() {
    return DD.c + 1;
}), _define_property(DD, "ff", function() {
    this.c;
});
