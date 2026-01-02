//// [for-inStatements.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
for(var x in '' ? c : d){}
for(var x in 42 ? d[x] : c[x]){}
for(var x in c[d]){}
for(var x in function(x) {
    return x;
}){}
for(var x in function(x, y) {
    return x + y;
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
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
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
(function(M) {
    var X = function X() {
        "use strict";
        _class_call_check(this, X);
    };
    M.X = X;
})(M || (M = {}));
for(var x in M){}
for(var x in M.X){}
var Color = /*#__PURE__*/ function(Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
    return Color;
}(Color || {});
for(var x in Color){}
for(var x in 1){}
var M;
