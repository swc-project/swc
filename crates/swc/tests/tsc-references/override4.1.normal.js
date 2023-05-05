//// [override4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
        this.p1 = 1;
        this.p2 = 1;
    }
    var _proto = B.prototype;
    _proto.foo = function foo(v) {};
    _proto.fooo = function fooo(v) {};
    return B;
}();
var D = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(D, B);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        var _this;
        _this = _super.apply(this, arguments);
        _this.p1 = 2;
        _this.p2 = 3;
        return _this;
    }
    var _proto = D.prototype;
    _proto.foo = function foo(v) {};
    _proto.fooo = function fooo(v) {};
    return D;
}(B);
var DD = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(DD, B);
    var _super = _create_super(DD);
    function DD() {
        _class_call_check(this, DD);
        return _super.apply(this, arguments);
    }
    return DD;
}(B);
