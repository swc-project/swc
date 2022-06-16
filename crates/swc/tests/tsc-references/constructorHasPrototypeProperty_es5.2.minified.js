var NonGeneric, Generic;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(NonGeneric) {
    var C = function() {
        "use strict";
        _class_call_check(this, C);
    }, D = function(C) {
        "use strict";
        _inherits(D, C);
        var _super = _create_super(D);
        function D() {
            return _class_call_check(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C);
    C.prototype.foo, D.prototype.bar;
}(NonGeneric || (NonGeneric = {})), function(Generic) {
    var C = function() {
        "use strict";
        _class_call_check(this, C);
    }, D = function(C) {
        "use strict";
        _inherits(D, C);
        var _super = _create_super(D);
        function D() {
            return _class_call_check(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C);
    C.prototype.foo, D.prototype.baz;
}(Generic || (Generic = {}));
