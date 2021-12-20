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
var BaseClass = /*#__PURE__*/ function() {
    "use strict";
    function BaseClass() {
        _classCallCheck(this, BaseClass);
    }
    _createClass(BaseClass, [
        {
            key: "baseMethod",
            value: function baseMethod() {
            }
        }
    ]);
    return BaseClass;
}();
var Child = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    _inherits(Child, BaseClass);
    var _super = _createSuper(Child);
    function Child() {
        _classCallCheck(this, Child);
        return _super.apply(this, arguments);
    }
    _createClass(Child, [
        {
            key: "method",
            value: function method() {
            }
        }
    ]);
    return Child;
}(BaseClass);
var ChildNoBaseClass = /*#__PURE__*/ function() {
    "use strict";
    function ChildNoBaseClass() {
        _classCallCheck(this, ChildNoBaseClass);
    }
    _createClass(ChildNoBaseClass, [
        {
            key: "method2",
            value: function method2() {
            }
        }
    ]);
    return ChildNoBaseClass;
}();
var Grandchild = /*#__PURE__*/ function(ChildNoBaseClass) {
    "use strict";
    _inherits(Grandchild, ChildNoBaseClass);
    var _super = _createSuper(Grandchild);
    function Grandchild() {
        _classCallCheck(this, Grandchild);
        return _super.apply(this, arguments);
    }
    return Grandchild;
}(ChildNoBaseClass);
// checks if properties actually were merged
var child;
child.required;
child.optional;
child.additional;
child.baseNumber;
child.classNumber;
child.baseMethod();
child.method();
var grandchild;
grandchild.required;
grandchild.optional;
grandchild.additional2;
grandchild.classString;
grandchild.method2();
