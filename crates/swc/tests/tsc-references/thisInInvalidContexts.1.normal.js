//// [thisInInvalidContexts.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var BaseErrClass = function BaseErrClass(t) {
    "use strict";
    _class_call_check(this, BaseErrClass);
};
var ClassWithNoInitializer = /*#__PURE__*/ function(BaseErrClass) {
    "use strict";
    _inherits(ClassWithNoInitializer, BaseErrClass);
    var _super = _create_super(ClassWithNoInitializer);
    function ClassWithNoInitializer() {
        _class_call_check(this, ClassWithNoInitializer);
        var _this;
        _this = _super.call(this, _assert_this_initialized(_this)); // Error
        return _this;
    }
    return ClassWithNoInitializer;
}(BaseErrClass);
var ClassWithInitializer = /*#__PURE__*/ function(BaseErrClass) {
    "use strict";
    _inherits(ClassWithInitializer, BaseErrClass);
    var _super = _create_super(ClassWithInitializer);
    function ClassWithInitializer() {
        _class_call_check(this, ClassWithInitializer);
        var _this;
        _this = _super.call(this, _assert_this_initialized(_this)); // Error
        _this.t = 4;
        return _this;
    }
    return ClassWithInitializer;
}(BaseErrClass);
var M;
(function(M) {
    //'this' in module variable
    var x = this; // Error
})(M || (M = {}));
//'this' as type parameter constraint
// function fn<T extends this >() { } // Error
//'this' as a type argument
function genericFunc(x) {}
genericFunc(undefined); // Should be an error
var ErrClass3 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(ErrClass3, _superClass);
    var _super = _create_super(ErrClass3);
    function ErrClass3() {
        _class_call_check(this, ErrClass3);
        return _super.apply(this, arguments);
    }
    return ErrClass3;
}(this);
var //'this' as a computed enum value
SomeEnum;
(function(SomeEnum) {
    SomeEnum[SomeEnum["A"] = this] = "A";
    SomeEnum[SomeEnum["B"] = this.spaaaace // Also should not be allowed
    ] = "B";
})(SomeEnum || (SomeEnum = {}));
