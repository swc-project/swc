//// [defineProperty.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
!function() {
    "use strict";
    function A(y) {
        _class_call_check(this, A), _define_property(this, "a", void 0), _define_property(this, "b", void 0), _define_property(this, "c", void 0), _define_property(this, "computed", void 0), _define_property(this, "p", void 0), _define_property(this, "z", void 0), _define_property(this, "y", void 0), this.y = y, this.a = this.y, this.computed = 13, this.p = 14, this.z = this.y;
    }
    return _create_class(A, [
        {
            key: "m",
            value: function() {}
        }
    ]), A;
}();
