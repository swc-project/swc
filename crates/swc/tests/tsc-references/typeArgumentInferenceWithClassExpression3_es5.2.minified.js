import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(function() {
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function() {
        "use strict";
        _class_call_check(this, x);
    };
})(function _class() {
    "use strict";
    _class_call_check(this, _class), this.prop = "hello";
}).length;
