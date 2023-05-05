//// [callChainWithSuper.ts]
// GH#34952
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
    _proto.method = function method() {};
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    _proto.method1 = function method1() {
        var _super_method;
        return (_super_method = _get(_get_prototype_of(Derived.prototype), "method", this)) === null || _super_method === void 0 ? void 0 : _super_method.call(this);
    };
    _proto.method2 = function method2() {
        var _super_method;
        return (_super_method = _get(_get_prototype_of(Derived.prototype), "method", this)) === null || _super_method === void 0 ? void 0 : _super_method.call(this);
    };
    return Derived;
}(Base);
