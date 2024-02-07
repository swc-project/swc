//// [typeOfThisInStaticMembers10.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var C = function C() {
    _class_call_check(this, C);
};
C.a = 1, C.b = C.a + 1;
var D = function(C) {
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D.foo = function() {
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
D.c = 2, D.d = D.c + 1, D.e = _get(_get_prototype_of(D), "a", D) + D.c + 1, D.f = function() {
    return D.c + 1;
}, D.ff = function() {
    this.c;
}, D = _ts_decorate([
    foo
], D);
var CC = function CC() {
    _class_call_check(this, CC);
};
CC.a = 1, CC.b = CC.a + 1;
var DD = function(CC) {
    _inherits(DD, CC);
    var _super = _create_super(DD);
    function DD() {
        return _class_call_check(this, DD), _super.apply(this, arguments);
    }
    return DD.foo = function() {
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
}(CC);
DD.c = 2, DD.d = DD.c + 1, DD.e = _get(_get_prototype_of(DD), "a", DD) + DD.c + 1, DD.f = function() {
    return DD.c + 1;
}, DD.ff = function() {
    this.c;
};
