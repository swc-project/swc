//// [computedPropertyNames31_ES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    return Base;
}();
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(C, Base);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        var _this = this;
        (function() {
            var obj = _define_property({}, _get(_get_prototype_of(C.prototype), "bar", _this).call(_this), function() {} // needs capture
            );
        });
        return 0;
    };
    return C;
}(Base);
