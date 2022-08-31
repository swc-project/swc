//// [thisInInvalidContexts.ts]
var M, SomeEnum;
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(BaseErrClass) {
    "use strict";
    _inherits(ClassWithNoInitializer, BaseErrClass);
    var _super = _create_super(ClassWithNoInitializer);
    function ClassWithNoInitializer() {
        var _this;
        return _class_call_check(this, ClassWithNoInitializer), _this = _super.call(this, _assert_this_initialized(_this));
    }
    return ClassWithNoInitializer;
}(function BaseErrClass(t) {
    "use strict";
    _class_call_check(this, BaseErrClass);
}), M || (M = {}), function(SomeEnum) {
    SomeEnum[SomeEnum.A = this] = "A", SomeEnum[SomeEnum.B = this.spaaaace] = "B";
}(SomeEnum || (SomeEnum = {}));
