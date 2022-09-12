//// [classWithStaticFieldInParameterInitializer.2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function(C) {
        "use strict";
        _inherits(_class, C);
        var _super = _create_super(_class);
        function _class() {
            return _class_call_check(this, _class), _super.apply(this, arguments);
        }
        return _class;
    }(C).x = 1;
}(), function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function(C) {
        "use strict";
        _inherits(_class, C);
        var _super = _create_super(_class);
        function _class() {
            return _class_call_check(this, _class), _super.apply(this, arguments);
        }
        return _class;
    }(C).x = 1, arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}();
