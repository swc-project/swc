var NonGeneric, Generic;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
!function(NonGeneric) {
    var C1 = function() {
        "use strict";
        _class_call_check(this, C1);
    }, D = function(C) {
        "use strict";
        _inherits(D, C);
        var _super = _create_super(D);
        function D() {
            return _class_call_check(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C1);
    C1.prototype.foo, D.prototype.bar;
}(NonGeneric || (NonGeneric = {})), function(Generic) {
    var C2 = function() {
        "use strict";
        _class_call_check(this, C2);
    }, D = function(C) {
        "use strict";
        _inherits(D, C);
        var _super = _create_super(D);
        function D() {
            return _class_call_check(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C2);
    C2.prototype.foo, D.prototype.baz;
}(Generic || (Generic = {}));
