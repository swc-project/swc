//// [typeOfThisInStaticMembers11.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
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
    _create_class(D, null, [
        {
            key: "foo",
            value: function foo1() {
                return this.c + 1;
            }
        },
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
    _create_class(DD, null, [
        {
            key: "foo",
            value: function foo1() {
                return this.c + 1;
            }
        },
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
_define_property(DD, "c", 2);
_define_property(DD, "d", DD.c + 1);
_define_property(DD, "e", super.a + DD.c + 1);
_define_property(DD, "f", function() {
    return DD.c + 1;
});
_define_property(DD, "ff", function() {
    this.c + 1;
});
