//// [constructorHasPrototypeProperty.ts]
var NonGeneric, Generic;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
!function(NonGeneric) {
    var C = function C() {
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
    var C = function C() {
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
