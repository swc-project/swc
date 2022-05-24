import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
export var Super = function(firstArg, secondArg) {
    "use strict";
    _class_call_check(this, Super);
};
export var Sub = function(Super1) {
    "use strict";
    _inherits(Sub, Super1);
    var _super = _create_super(Sub);
    function Sub() {
        return _class_call_check(this, Sub), _super.call(this, "first", "second");
    }
    return Sub;
}(Super);
