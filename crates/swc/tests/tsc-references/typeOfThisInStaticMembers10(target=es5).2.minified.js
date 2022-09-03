//// [typeOfThisInStaticMembers10.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
var _C, _D, C = ((_C = function C() {
    "use strict";
    _class_call_check(this, C);
}).a = 1, _C.b = _C.a + 1, _C);
C = _ts_decorate([
    foo
], C);
var D = ((_D = function(C) {
    "use strict";
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
}(C)).c = 2, _D.d = _D.c + 1, _D.e = _get(_get_prototype_of(_D), "a", _D) + _D.c + 1, _D.f = function() {
    return _D.c + 1;
}, _D.ff = function() {
    this.c;
}, _D);
D = _ts_decorate([
    foo
], D);
var CC = function CC() {
    "use strict";
    _class_call_check(this, CC);
};
CC.a = 1, CC.b = CC.a + 1;
var DD = function(CC) {
    "use strict";
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
