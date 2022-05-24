var NonGeneric, Generics;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
!function(NonGeneric) {
    var C = function(x) {
        "use strict";
        _class_call_check(this, C);
    };
    new C(), new C("");
    var C21 = function(x) {
        "use strict";
        _class_call_check(this, C21);
    };
    new C21(), new C21(""), new C21(1);
    var D = function(C2) {
        "use strict";
        _inherits(D, C2);
        var _super = _create_super(D);
        function D() {
            return _class_call_check(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C21);
    new D(), new D(1), new D("");
}(NonGeneric || (NonGeneric = {})), function(Generics) {
    var C = function(x) {
        "use strict";
        _class_call_check(this, C);
    };
    new C(), new C("");
    var C22 = function(x) {
        "use strict";
        _class_call_check(this, C22);
    };
    new C22(), new C22(""), new C22(1, 2);
    var D = function(C2) {
        "use strict";
        _inherits(D, C2);
        var _super = _create_super(D);
        function D() {
            return _class_call_check(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C22);
    new D(), new D(1), new D("");
}(Generics || (Generics = {}));
