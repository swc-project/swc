import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: esnext
// @noImplicitOverride: true
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    _proto.m1 = function m1() {};
    _proto.m2 = function m2() {};
    return _class;
}();
export var Bar = /*#__PURE__*/ function(Foo1) {
    "use strict";
    _inherits(Bar, Foo1);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
        return _super.apply(this, arguments);
    }
    var _proto = Bar.prototype;
    _proto.m1 = function m1() {
        _get(_get_prototype_of(Bar.prototype), "m1", this).call(this);
    };
    _proto.m2 = function m2() {
        _get(_get_prototype_of(Bar.prototype), "m2", this).call(this);
    };
    return Bar;
}(Foo);
