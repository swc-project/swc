//// [fluentClasses.ts]
var c;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C.prototype.baz = function() {
        return this;
    }, C;
}(function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.bar = function() {
        return this;
    }, B;
}(function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {
        return this;
    }, A;
}())), c.foo().bar().baz();
