function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    this.a = 10;
};
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
var E = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(E, A);
    var _super = _createSuper(E);
    function E() {
        _classCallCheck(this, E);
        return _super.apply(this, arguments);
    }
    return E;
}(A);
var F = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(F, A);
    var _super = _createSuper(F);
    function F() {
        _classCallCheck(this, F);
        return _super.apply(this, arguments);
    }
    return F;
}(A);
var E11;
(function(E1) {
    E1[E1["one"] = 0] = "one";
})(E11 || (E11 = {
}));
var E21;
(function(E2) {
    E2[E2["one"] = 0] = "one";
})(E21 || (E21 = {
}));
// no error
var numStrTuple = [
    5,
    "foo"
];
var emptyObjTuple = numStrTuple;
var numStrBoolTuple = numStrTuple;
var shorter = numStrBoolTuple;
var longer = numStrTuple;
var classCDTuple = [
    new C(),
    new D()
];
var interfaceIITuple = classCDTuple;
var classCDATuple = classCDTuple;
var eleFromCDA1 = classCDATuple[2]; // A
var eleFromCDA2 = classCDATuple[5]; // C | D | A
var t10 = [
    E11.one,
    E21.one
];
var t11 = t10;
var array1 = emptyObjTuple;
var unionTuple = [
    new C(),
    "foo"
];
var unionTuple2 = [
    new C(),
    "foo",
    new D()
];
var unionTuple3 = [
    10,
    "foo"
];
var unionTuple4 = unionTuple3;
// error
var t3 = numStrTuple;
var t9 = classCDTuple;
var array1 = numStrTuple;
t4[2] = 10;
