//// [a.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _this = this;
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
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
// this override should be fine (even if it's a little odd)
C.prototype.foo = function() {};
var D = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(D, B);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(B);
D.prototype.foo = function() {
    _this.n = 'not checked, so no error';
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
    function NormalModule() {
        _class_call_check(this, NormalModule);
        return _call_super(this, NormalModule, arguments);
    }
    var _proto = NormalModule.prototype;
    _proto.identifier = function identifier() {
        return 'normal';
    };
    _proto.size = function size() {
        return 0;
    };
    return NormalModule;
}(Module);
