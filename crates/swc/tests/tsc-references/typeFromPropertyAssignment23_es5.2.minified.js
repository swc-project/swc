import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var _this = this, B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B), this.n = 1;
    }
    return B.prototype.foo = function() {}, B;
}(), C = function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C.prototype.foo = function() {};
var D = function(B) {
    "use strict";
    _inherits(D, B);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(B);
D.prototype.foo = function() {
    _this.n = "not checked, so no error";
};
var Module = function() {
    "use strict";
    _class_call_check(this, Module);
};
Module.prototype.identifier = void 0, Module.prototype.size = null;
var NormalModule = function(Module1) {
    "use strict";
    _inherits(NormalModule, Module1);
    var _super = _create_super(NormalModule);
    function NormalModule() {
        return _class_call_check(this, NormalModule), _super.apply(this, arguments);
    }
    var _proto = NormalModule.prototype;
    return _proto.identifier = function() {
        return "normal";
    }, _proto.size = function() {
        return 0;
    }, NormalModule;
}(Module);
