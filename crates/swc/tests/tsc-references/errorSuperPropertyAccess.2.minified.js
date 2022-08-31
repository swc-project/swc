//// [errorSuperPropertyAccess.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
!function() {
    "use strict";
    function NoBase() {
        _class_call_check(this, NoBase), this.m = _get(_get_prototype_of(NoBase.prototype), "prototype", this), this.n = _get(_get_prototype_of(NoBase.prototype), "hasOwnProperty", this).call(this, ""), _get(_get_prototype_of(NoBase.prototype), "prototype", this), _get(_get_prototype_of(NoBase.prototype), "hasOwnProperty", this).call(this, "");
    }
    return NoBase.prototype.fn = function() {
        _get(_get_prototype_of(NoBase.prototype), "prototype", this), _get(_get_prototype_of(NoBase.prototype), "hasOwnProperty", this).call(this, "");
    }, NoBase.static1 = function() {
        _get(_get_prototype_of(NoBase), "hasOwnProperty", this).call(this, "");
    }, _create_class(NoBase, null, [
        {
            key: "static2",
            get: function() {
                return _get(_get_prototype_of(NoBase), "hasOwnProperty", this).call(this, ""), "";
            },
            set: function(n) {
                _get(_get_prototype_of(NoBase), "hasOwnProperty", this).call(this, "");
            }
        }
    ]), NoBase;
}();
var SomeBase = function() {
    "use strict";
    function SomeBase() {
        _class_call_check(this, SomeBase), this.privateMember = 0, this.publicMember = 0;
    }
    var _proto = SomeBase.prototype;
    return _proto.privateFunc = function() {}, _proto.publicFunc = function() {}, SomeBase.privateStaticFunc = function() {}, SomeBase.publicStaticFunc = function() {}, SomeBase;
}();
SomeBase.privateStaticMember = 0, SomeBase.publicStaticMember = 0, super.wat, super.foo();
