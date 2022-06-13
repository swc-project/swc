import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Foo = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    return _proto.m1 = function() {}, _proto.m2 = function() {}, _class;
}();
export var Bar = function(Foo1) {
    "use strict";
    _inherits(Bar, Foo1);
    var _super = _create_super(Bar);
    function Bar() {
        return _class_call_check(this, Bar), _super.apply(this, arguments);
    }
    var _proto = Bar.prototype;
    return _proto.m1 = function() {
        _get(_get_prototype_of(Bar.prototype), "m1", this).call(this);
    }, _proto.m2 = function() {
        _get(_get_prototype_of(Bar.prototype), "m2", this).call(this);
    }, Bar;
}(Foo);
