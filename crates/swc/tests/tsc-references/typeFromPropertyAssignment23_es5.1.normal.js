import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this;
// @noEmit: true
// @checkJs: true
// @allowJs: true
// @Filename: a.js
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
        this.n = 1;
    }
    var _proto = B.prototype;
    _proto.foo = function foo() {};
    return B;
}();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
// this override should be fine (even if it's a little odd)
C.prototype.foo = function() {};
var D = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(D, B);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(B);
D.prototype.foo = function() {
    _this.n = "not checked, so no error";
};
// post-class prototype assignments are trying to show that these properties are abstract
var Module = function Module() {
    "use strict";
    _class_call_check(this, Module);
};
Module.prototype.identifier = undefined;
Module.prototype.size = null;
var NormalModule = /*#__PURE__*/ function(Module) {
    "use strict";
    _inherits(NormalModule, Module);
    var _super = _create_super(NormalModule);
    function NormalModule() {
        _class_call_check(this, NormalModule);
        return _super.apply(this, arguments);
    }
    var _proto = NormalModule.prototype;
    _proto.identifier = function identifier() {
        return "normal";
    };
    _proto.size = function size() {
        return 0;
    };
    return NormalModule;
}(Module);
