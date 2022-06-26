import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var NoBase = function() {
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
}(), SomeBase = function() {
    "use strict";
    function SomeBase() {
        _class_call_check(this, SomeBase), this.privateMember = 0, this.publicMember = 0;
    }
    var _proto = SomeBase.prototype;
    return _proto.privateFunc = function() {}, _proto.publicFunc = function() {}, SomeBase.privateStaticFunc = function() {}, SomeBase.publicStaticFunc = function() {}, SomeBase;
}();
SomeBase.privateStaticMember = 0, SomeBase.publicStaticMember = 0;
var SomeDerived1 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived1, SomeBase);
    var _super = _create_super(SomeDerived1);
    function SomeDerived1() {
        _class_call_check(this, SomeDerived1);
        var _this = _super.call(this);
        return _set((_assert_this_initialized(_this), _get_prototype_of(SomeDerived1.prototype)), "publicMember", 1, _this, !0), _this;
    }
    var _proto = SomeDerived1.prototype;
    return _proto.fn = function() {
        _get(_get_prototype_of(SomeDerived1.prototype), "publicMember", this);
    }, _proto.fn2 = function() {}, _create_class(SomeDerived1, [
        {
            key: "a",
            get: function() {
                _get(_get_prototype_of(SomeDerived1.prototype), "publicMember", this);
            },
            set: function(n) {
                _get(_get_prototype_of(SomeDerived1.prototype), "publicMember", this);
            }
        }
    ]), SomeDerived1;
}(SomeBase), SomeDerived2 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived2, SomeBase);
    var _super = _create_super(SomeDerived2);
    function SomeDerived2() {
        _class_call_check(this, SomeDerived2);
        var _this = _super.call(this);
        return _set((_assert_this_initialized(_this), _get_prototype_of(SomeDerived2.prototype)), "privateMember", 1, _this, !0), _this;
    }
    return SomeDerived2.prototype.fn = function() {
        _get(_get_prototype_of(SomeDerived2.prototype), "privateMember", this);
    }, _create_class(SomeDerived2, [
        {
            key: "a",
            get: function() {
                _get(_get_prototype_of(SomeDerived2.prototype), "privateMember", this);
            },
            set: function(n) {
                _get(_get_prototype_of(SomeDerived2.prototype), "privateMember", this);
            }
        }
    ]), SomeDerived2;
}(SomeBase), SomeDerived3 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived3, SomeBase);
    var _super = _create_super(SomeDerived3);
    function SomeDerived3() {
        return _class_call_check(this, SomeDerived3), _super.apply(this, arguments);
    }
    return SomeDerived3.fn = function() {
        _set(_get_prototype_of(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), _set(_get_prototype_of(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), _get(_get_prototype_of(SomeDerived3), "privateStaticFunc", this).call(this);
    }, _create_class(SomeDerived3, null, [
        {
            key: "a",
            get: function() {
                return _set(_get_prototype_of(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), _set(_get_prototype_of(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), _get(_get_prototype_of(SomeDerived3), "privateStaticFunc", this).call(this), "";
            },
            set: function(n) {
                _set(_get_prototype_of(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), _set(_get_prototype_of(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), _get(_get_prototype_of(SomeDerived3), "privateStaticFunc", this).call(this);
            }
        }
    ]), SomeDerived3;
}(SomeBase);
super.wat, super.foo();
