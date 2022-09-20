//// [thisInInvalidContexts.ts]
var M, SomeEnum;
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
M || (M = {}), function(SomeEnum) {
    SomeEnum[SomeEnum.A = this] = "A", SomeEnum[SomeEnum.B = this.spaaaace] = "B";
}(SomeEnum || (SomeEnum = {}));
