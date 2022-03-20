var NonGeneric, Generics;
import * as swcHelpers from "@swc/helpers";
!function(NonGeneric) {
    var C = function(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
    new C(), new C("");
    var C21 = function(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C21);
    };
    new C21(), new C21(""), new C21(1);
    var D = function(C2) {
        "use strict";
        swcHelpers.inherits(D, C2);
        var _super = swcHelpers.createSuper(D);
        function D() {
            return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C21);
    new D(), new D(1), new D("");
}(NonGeneric || (NonGeneric = {})), function(Generics) {
    var C = function(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
    new C(), new C("");
    var C22 = function(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C22);
    };
    new C22(), new C22(""), new C22(1, 2);
    var D = function(C2) {
        "use strict";
        swcHelpers.inherits(D, C2);
        var _super = swcHelpers.createSuper(D);
        function D() {
            return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C22);
    new D(), new D(1), new D("");
}(Generics || (Generics = {}));
