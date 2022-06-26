import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @skipDefaultLibCheck: false
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.valueOf = function valueOf() {};
    return C;
}();
var c;
var r1 = c.valueOf();
var r1b = c.data;
var r1c = r1b["hm"]; // should be 'Object'
var r1d = c["hm"]; // should be 'any'
var i;
var r2 = i.valueOf();
var r2b = i.data;
var r2c = r2b["hm"]; // should be 'Object'
var r2d = i["hm"]; // should be 'any'
var a = {
    valueOf: function() {},
    data: new B()
};
var r3 = a.valueOf();
var r3b = a.data;
var r3c = r3b["hm"]; // should be 'Object'
var r3d = i["hm"];
var b;
var r4 = b.valueOf();
