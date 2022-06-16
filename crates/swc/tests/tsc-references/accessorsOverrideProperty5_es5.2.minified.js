import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var B = function() {
    "use strict";
    _class_call_check(this, B);
}, C = function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return _create_class(C, [
        {
            key: "p",
            get: function() {
                return 1;
            },
            set: function(value) {}
        }
    ]), C;
}(B);
