//// [thisInInvalidContexts.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var M, SomeEnum, BaseErrClass = function BaseErrClass(t) {
    "use strict";
    _class_call_check(this, BaseErrClass);
}, ClassWithNoInitializer = function(BaseErrClass) {
    "use strict";
    _inherits(ClassWithNoInitializer, BaseErrClass);
    var _super = _create_super(ClassWithNoInitializer);
    function ClassWithNoInitializer() {
        var _this;
        return _class_call_check(this, ClassWithNoInitializer), _this = _super.call(this, _assert_this_initialized(_this));
    }
    return ClassWithNoInitializer;
}(BaseErrClass), ClassWithInitializer = function(BaseErrClass) {
    "use strict";
    _inherits(ClassWithInitializer, BaseErrClass);
    var _super = _create_super(ClassWithInitializer);
    function ClassWithInitializer() {
        var _this;
        return _class_call_check(this, ClassWithInitializer), (_this = _super.call(this, _assert_this_initialized(_this))).t = 4, _this;
    }
    return ClassWithInitializer;
}(BaseErrClass);
function genericFunc(x) {}
M || (M = {}), genericFunc(void 0);
var ErrClass3 = function(_superClass) {
    "use strict";
    _inherits(ErrClass3, _superClass);
    var _super = _create_super(ErrClass3);
    function ErrClass3() {
        return _class_call_check(this, ErrClass3), _super.apply(this, arguments);
    }
    return ErrClass3;
}(this);
!function(SomeEnum) {
    SomeEnum[SomeEnum.A = this] = "A", SomeEnum[SomeEnum.B = this.spaaaace] = "B";
}(SomeEnum || (SomeEnum = {}));
