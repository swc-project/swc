import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var aString;
for(aString in {}){}
var anAny;
for(anAny in {}){}
for(var x in {}){}
for(var x in []){}
for(var x in [
    1,
    2,
    3,
    4,
    5
]){}
function fn() {}
for(var x in fn()){}
for(var x in /[a-z]/){}
for(var x in new Date()){}
var c, d, e;
for(var x in c || d){}
for(var x in e ? c : d){}
for(var x in 42 ? c : d){}
for(var x in "" ? c : d){}
for(var x in 42 ? d[x] : c[x]){}
for(var x in c[d]){}
for(var x in function(x1) {
    return x1;
}){}
for(var x in function(x2, y) {
    return x2 + y;
}){}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.biz = function biz() {
        for(var x in this.biz()){}
        for(var x in this.biz){}
        for(var x in this){}
        return null;
    };
    A.baz = function baz() {
        for(var x in this){}
        for(var x in this.baz){}
        for(var x in this.baz()){}
        return null;
    };
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.boz = function boz() {
        for(var x in this.biz()){}
        for(var x in this.biz){}
        for(var x in this){}
        for(var x in _get(_get_prototype_of(B.prototype), "biz", this)){}
        for(var x in _get(_get_prototype_of(B.prototype), "biz", this).call(this)){}
        return null;
    };
    return B;
}(A);
var i;
for(var x in i[42]){}
var M;
(function(M1) {
    var X = function X() {
        "use strict";
        _class_call_check(this, X);
    };
    M1.X = X;
})(M || (M = {}));
for(var x in M){}
for(var x in M.X){}
var Color;
(function(Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
})(Color || (Color = {}));
for(var x in Color){}
for(var x in Color.Blue){}
