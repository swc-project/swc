//// [classWithConstructors.ts]
var NonGeneric, Generics;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
!function(NonGeneric) {
    var C = function C(x) {
        "use strict";
        _class_call_check(this, C);
    };
    new C(), new C("");
    var C2 = function C2(x) {
        "use strict";
        _class_call_check(this, C2);
    };
    new C2(), new C2(""), new C2(1);
    var D = function(C2) {
        "use strict";
        _inherits(D, C2);
        var _super = _create_super(D);
        function D() {
            return _class_call_check(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C2);
    new D(), new D(1), new D("");
}(NonGeneric || (NonGeneric = {})), function(Generics) {
    var C = function C(x) {
        "use strict";
        _class_call_check(this, C);
    };
    new C(), new C("");
    var C2 = function C2(x) {
        "use strict";
        _class_call_check(this, C2);
    };
    new C2(), new C2(""), new C2(1, 2);
    var D = function(C2) {
        "use strict";
        _inherits(D, C2);
        var _super = _create_super(D);
        function D() {
            return _class_call_check(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C2);
    new D(), new D(1), new D("");
}(Generics || (Generics = {}));
