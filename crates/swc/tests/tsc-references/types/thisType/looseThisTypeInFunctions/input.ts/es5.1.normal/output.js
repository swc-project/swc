function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "explicitThis",
            value: function explicitThis(m) {
                return this.n + m;
            }
        },
        {
            key: "implicitThis",
            value: function implicitThis(m) {
                return this.n + m;
            }
        },
        {
            key: "explicitVoid",
            value: function explicitVoid(m) {
                return m + 1;
            }
        }
    ]);
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
