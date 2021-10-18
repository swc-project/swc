function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: !0,
            configurable: !0
        }
    }), superClass && _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var Errors, WithGenericSignaturesInBaseType, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
!function(Errors) {
    var r1arg1, r2arg1, r3arg1, r4arg1, r5arg1, r6arg1, r7arg1, r7arg3, r8arg, r9arg, Base = function() {
        "use strict";
        _classCallCheck(this, Base);
    }, Derived = function(Base) {
        "use strict";
        function Derived() {
            return _classCallCheck(this, Derived), _possibleConstructorReturn(this, _getPrototypeOf(Derived).apply(this, arguments));
        }
        return _inherits(Derived, Base), Derived;
    }(Base), Derived2 = function(Derived) {
        "use strict";
        function Derived2() {
            return _classCallCheck(this, Derived2), _possibleConstructorReturn(this, _getPrototypeOf(Derived2).apply(this, arguments));
        }
        return _inherits(Derived2, Derived), Derived2;
    }(Derived), OtherDerived = function(Base) {
        "use strict";
        function OtherDerived() {
            return _classCallCheck(this, OtherDerived), _possibleConstructorReturn(this, _getPrototypeOf(OtherDerived).apply(this, arguments));
        }
        return _inherits(OtherDerived, Base), OtherDerived;
    }(Base);
    foo2(r1arg1), foo7(r2arg1), foo8(r3arg1), foo10(r4arg1), foo11(r5arg1), foo12(r6arg1), foo15(r7arg1), foo15(r7arg3), foo16(r8arg), foo17(r9arg);
}(Errors || (Errors = {
})), (function(WithGenericSignaturesInBaseType) {
    var r3arg2;
    foo2(void 0), foo3(r3arg2);
})(WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {
}));
