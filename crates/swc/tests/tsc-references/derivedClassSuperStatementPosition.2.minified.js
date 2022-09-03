//// [derivedClassSuperStatementPosition.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var DerivedBasic = function(Object1) {
    "use strict";
    _inherits(DerivedBasic, Object1);
    var _super = _create_super(DerivedBasic);
    function DerivedBasic() {
        var _this;
        return _class_call_check(this, DerivedBasic), (_this = _super.call(this)).prop = 1, _this;
    }
    return DerivedBasic;
}(_wrap_native_super(Object)), DerivedAfterParameterDefault = function(Object1) {
    "use strict";
    _inherits(DerivedAfterParameterDefault, Object1);
    var _super = _create_super(DerivedAfterParameterDefault);
    function DerivedAfterParameterDefault() {
        var _this, x = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        return _class_call_check(this, DerivedAfterParameterDefault), _this.x1 = x, (_this = _super.call(this, x)).x2 = x, _this;
    }
    return DerivedAfterParameterDefault;
}(_wrap_native_super(Object)), DerivedAfterRestParameter = function(Object1) {
    "use strict";
    _inherits(DerivedAfterRestParameter, Object1);
    var _super = _create_super(DerivedAfterRestParameter);
    function DerivedAfterRestParameter() {
        for(var _this, _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
        return _class_call_check(this, DerivedAfterRestParameter), _this.x1 = x, (_this = _super.call(this, x)).x2 = x, _this;
    }
    return DerivedAfterRestParameter;
}(_wrap_native_super(Object)), DerivedComments = function(Object1) {
    "use strict";
    _inherits(DerivedComments, Object1);
    var _super = _create_super(DerivedComments);
    function DerivedComments() {
        var _this;
        return _class_call_check(this, DerivedComments), console.log(), (_this = _super.call(this)).x = null, _this;
    }
    return DerivedComments;
}(_wrap_native_super(Object)), DerivedCommentsInvalidThis = function(Object1) {
    "use strict";
    _inherits(DerivedCommentsInvalidThis, Object1);
    var _super = _create_super(DerivedCommentsInvalidThis);
    function DerivedCommentsInvalidThis() {
        var _this;
        return _class_call_check(this, DerivedCommentsInvalidThis), _assert_this_initialized(_this), console.log(), (_this = _super.call(this)).x = null, _this;
    }
    return DerivedCommentsInvalidThis;
}(_wrap_native_super(Object)), DerivedInConditional = function(Object1) {
    "use strict";
    _inherits(DerivedInConditional, Object1);
    var _super = _create_super(DerivedInConditional);
    function DerivedInConditional() {
        var _this, _temp;
        return _class_call_check(this, DerivedInConditional), Math.random() ? (_temp = _this = _super.call(this, 1), _this.prop = 1, _temp) : (_temp = _this = _super.call(this, 0), _this.prop = 1, _temp), _possible_constructor_return(_this);
    }
    return DerivedInConditional;
}(_wrap_native_super(Object)), DerivedInIf = function(Object1) {
    "use strict";
    _inherits(DerivedInIf, Object1);
    var _super = _create_super(DerivedInIf);
    function DerivedInIf() {
        var _this;
        return _class_call_check(this, DerivedInIf), Math.random() ? (_this = _super.call(this, 1)).prop = 1 : (_this = _super.call(this, 0)).prop = 1, _possible_constructor_return(_this);
    }
    return DerivedInIf;
}(_wrap_native_super(Object)), DerivedInBlockWithProperties = function(Object1) {
    "use strict";
    _inherits(DerivedInBlockWithProperties, Object1);
    var _super = _create_super(DerivedInBlockWithProperties);
    function DerivedInBlockWithProperties() {
        var _this, paramProp = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2;
        return _class_call_check(this, DerivedInBlockWithProperties), (_this = _super.call(this)).paramProp = paramProp, _this.prop = 1, _possible_constructor_return(_this);
    }
    return DerivedInBlockWithProperties;
}(_wrap_native_super(Object)), DerivedInConditionalWithProperties = function(Object1) {
    "use strict";
    _inherits(DerivedInConditionalWithProperties, Object1);
    var _super = _create_super(DerivedInConditionalWithProperties);
    function DerivedInConditionalWithProperties() {
        var _this, paramProp = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2;
        return _class_call_check(this, DerivedInConditionalWithProperties), Math.random() ? ((_this = _super.call(this, 1)).paramProp = paramProp, _this.prop = 1) : ((_this = _super.call(this, 0)).paramProp = paramProp, _this.prop = 1), _possible_constructor_return(_this);
    }
    return DerivedInConditionalWithProperties;
}(_wrap_native_super(Object));
