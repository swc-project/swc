//// [override8.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var D = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(D, B);
    function D(a, b) {
        _class_call_check(this, D);
        var _this;
        _this = _call_super(this, D), _this.a = a, _this.b = b;
        return _this;
    }
    return D;
}(B);
var BB = function BB(a) {
    "use strict";
    _class_call_check(this, BB);
    this.a = a;
};
var DD = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(DD, BB);
    function DD(a) {
        _class_call_check(this, DD);
        var _this;
        _this = _call_super(this, DD, [
            a
        ]), _this.a = a;
        return _this;
    }
    return DD;
}(BB);
var DDD = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(DDD, BB);
    function DDD(a) {
        _class_call_check(this, DDD);
        var _this;
        _this = _call_super(this, DDD, [
            a
        ]);
        _this.a = a;
        return _this;
    }
    return DDD;
}(BB);
