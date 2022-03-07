var NonGeneric, Generic;
import * as swcHelpers from "@swc/helpers";
!function(NonGeneric) {
    var C1 = function() {
        "use strict";
        swcHelpers.classCallCheck(this, C1);
    }, D = function(C) {
        "use strict";
        swcHelpers.inherits(D, C);
        var _super = swcHelpers.createSuper(D);
        function D() {
            return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C1);
    C1.prototype.foo, D.prototype.bar;
}(NonGeneric || (NonGeneric = {})), function(Generic) {
    var C2 = function() {
        "use strict";
        swcHelpers.classCallCheck(this, C2);
    }, D = function(C) {
        "use strict";
        swcHelpers.inherits(D, C);
        var _super = swcHelpers.createSuper(D);
        function D() {
            return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C2);
    C2.prototype.foo, D.prototype.baz;
}(Generic || (Generic = {}));
