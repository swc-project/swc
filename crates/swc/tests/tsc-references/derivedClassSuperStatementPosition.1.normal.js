//// [derivedClassSuperStatementPosition.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var DerivedBasic = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedBasic, Object1);
    var _super = _create_super(DerivedBasic);
    function DerivedBasic() {
        _class_call_check(this, DerivedBasic);
        var _this;
        _this = _super.call(this);
        _this.prop = 1;
        return _this;
    }
    return DerivedBasic;
}(_wrap_native_super(Object));
var DerivedAfterParameterDefault = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedAfterParameterDefault, Object1);
    var _super = _create_super(DerivedAfterParameterDefault);
    function DerivedAfterParameterDefault() {
        var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        _class_call_check(this, DerivedAfterParameterDefault);
        var _this;
        _this.x1 = x;
        _this = _super.call(this, x);
        _this.x2 = x;
        return _this;
    }
    return DerivedAfterParameterDefault;
}(_wrap_native_super(Object));
var DerivedAfterRestParameter = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedAfterRestParameter, Object1);
    var _super = _create_super(DerivedAfterRestParameter);
    function DerivedAfterRestParameter() {
        for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
            x[_key] = arguments[_key];
        }
        _class_call_check(this, DerivedAfterRestParameter);
        var _this;
        _this.x1 = x;
        _this = _super.call(this, x);
        _this.x2 = x;
        return _this;
    }
    return DerivedAfterRestParameter;
}(_wrap_native_super(Object));
var DerivedComments = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedComments, Object1);
    var _super = _create_super(DerivedComments);
    function DerivedComments() {
        _class_call_check(this, DerivedComments);
        var _this;
        // c1
        console.log(); // c2
        _this = _super.call(this); // c4
        // c5
        _this.x = null; // c6
        return _this;
    }
    return DerivedComments;
}(_wrap_native_super(Object));
var DerivedCommentsInvalidThis = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedCommentsInvalidThis, Object1);
    var _super = _create_super(DerivedCommentsInvalidThis);
    function DerivedCommentsInvalidThis() {
        _class_call_check(this, DerivedCommentsInvalidThis);
        var _this;
        _assert_this_initialized(_this);
        // c1
        console.log(); // c2
        _this = _super.call(this); // c4
        // c5
        _this.x = null; // c6
        return _this;
    }
    return DerivedCommentsInvalidThis;
}(_wrap_native_super(Object));
var DerivedInConditional = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedInConditional, Object1);
    var _super = _create_super(DerivedInConditional);
    function DerivedInConditional() {
        _class_call_check(this, DerivedInConditional);
        var _this;
        var _temp;
        Math.random() ? (_temp = _this = _super.call(this, 1), _this.prop = 1, _temp) : (_temp = _this = _super.call(this, 0), _this.prop = 1, _temp);
        return _possible_constructor_return(_this);
    }
    return DerivedInConditional;
}(_wrap_native_super(Object));
var DerivedInIf = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedInIf, Object1);
    var _super = _create_super(DerivedInIf);
    function DerivedInIf() {
        _class_call_check(this, DerivedInIf);
        var _this;
        if (Math.random()) {
            _this = _super.call(this, 1);
            _this.prop = 1;
        } else {
            _this = _super.call(this, 0);
            _this.prop = 1;
        }
        return _possible_constructor_return(_this);
    }
    return DerivedInIf;
}(_wrap_native_super(Object));
var DerivedInBlockWithProperties = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedInBlockWithProperties, Object1);
    var _super = _create_super(DerivedInBlockWithProperties);
    function DerivedInBlockWithProperties() {
        var paramProp = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2;
        _class_call_check(this, DerivedInBlockWithProperties);
        var _this;
        {
            _this = _super.call(this);
            _this.paramProp = paramProp;
            _this.prop = 1;
        }
        return _possible_constructor_return(_this);
    }
    return DerivedInBlockWithProperties;
}(_wrap_native_super(Object));
var DerivedInConditionalWithProperties = /*#__PURE__*/ function(Object1) {
    "use strict";
    _inherits(DerivedInConditionalWithProperties, Object1);
    var _super = _create_super(DerivedInConditionalWithProperties);
    function DerivedInConditionalWithProperties() {
        var paramProp = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2;
        _class_call_check(this, DerivedInConditionalWithProperties);
        var _this;
        if (Math.random()) {
            _this = _super.call(this, 1);
            _this.paramProp = paramProp;
            _this.prop = 1;
        } else {
            _this = _super.call(this, 0);
            _this.paramProp = paramProp;
            _this.prop = 1;
        }
        return _possible_constructor_return(_this);
    }
    return DerivedInConditionalWithProperties;
}(_wrap_native_super(Object));
