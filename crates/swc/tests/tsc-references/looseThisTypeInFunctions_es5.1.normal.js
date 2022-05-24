import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.explicitThis = function explicitThis(m) {
        return this.n + m;
    };
    _proto.implicitThis = function implicitThis(m) {
        return this.n + m;
    };
    _proto.explicitVoid = function explicitVoid(m) {
        return m + 1;
    };
    return C;
}();
var c = new C();
c.explicitVoid = c.explicitThis; // error, 'void' is missing everything
var o = {
    n: 101,
    explicitThis: function explicitThis(m) {
        return m + this.n.length; // error, 'length' does not exist on 'number'
    },
    implicitThis: function implicitThis(m) {
        return m;
    }
};
var i = o;
var o2 = {
    n: 1001,
    explicitThis: function explicitThis(m) {
        return m + this.n.length; // error, this.n: number, no member 'length'
    }
};
var x = i.explicitThis;
var n = x(12); // callee:void doesn't match this:I
var u;
var y = u.implicitNoThis;
n = y(12); // ok, callee:void matches this:any
c.explicitVoid = c.implicitThis // ok, implicitThis(this:any)
;
o.implicitThis = c.implicitThis; // ok, implicitThis(this:any)
o.implicitThis = c.explicitThis; // ok, implicitThis(this:any) is assignable to explicitThis(this: this)
o.implicitThis = i.explicitThis;
i.explicitThis = function(m) {
    return this.n.length; // error, this.n: number
};
