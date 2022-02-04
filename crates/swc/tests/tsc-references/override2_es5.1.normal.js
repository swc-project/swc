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
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
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
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
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
var AB = function AB() {
    "use strict";
    _classCallCheck(this, AB);
};
var AD1 = /*#__PURE__*/ function(AB) {
    "use strict";
    _inherits(AD1, AB);
    var _super = _createSuper(AD1);
    function AD1() {
        _classCallCheck(this, AD1);
        return _super.apply(this, arguments);
    }
    return AD1;
}(AB);
var AD2 = /*#__PURE__*/ function(AB) {
    "use strict";
    _inherits(AD2, AB);
    var _super = _createSuper(AD2);
    function AD2() {
        _classCallCheck(this, AD2);
        return _super.apply(this, arguments);
    }
    return AD2;
}(AB);
var AD3 = /*#__PURE__*/ function(AB) {
    "use strict";
    _inherits(AD3, AB);
    var _super = _createSuper(AD3);
    function AD3() {
        _classCallCheck(this, AD3);
        return _super.apply(this, arguments);
    }
    _createClass(AD3, [
        {
            key: "foo",
            value: function foo(v) {} // need override?
        },
        {
            key: "baz",
            value: function baz() {}
        }
    ]);
    return AD3;
}(AB);
var D4 = /*#__PURE__*/ function(AB) {
    "use strict";
    _inherits(D4, AB);
    var _super = _createSuper(D4);
    function D4() {
        _classCallCheck(this, D4);
        return _super.apply(this, arguments);
    }
    _createClass(D4, [
        {
            key: "foo",
            value: function foo(v) {}
        },
        {
            key: "bar",
            value: function bar(v) {}
        },
        {
            key: "baz",
            value: function baz() {}
        }
    ]);
    return D4;
}(AB);
