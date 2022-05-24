import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
