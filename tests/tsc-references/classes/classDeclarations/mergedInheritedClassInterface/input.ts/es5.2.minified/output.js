function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
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
var child, grandchild, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, BaseClass = function() {
    "use strict";
    function BaseClass() {
        _classCallCheck(this, BaseClass);
    }
    return _createClass(BaseClass, [
        {
            key: "baseMethod",
            value: function() {
            }
        }
    ]), BaseClass;
}(), Child = function(BaseClass) {
    "use strict";
    function Child() {
        return _classCallCheck(this, Child), _possibleConstructorReturn(this, _getPrototypeOf(Child).apply(this, arguments));
    }
    return _inherits(Child, BaseClass), _createClass(Child, [
        {
            key: "method",
            value: function() {
            }
        }
    ]), Child;
}(BaseClass), ChildNoBaseClass = function() {
    "use strict";
    function ChildNoBaseClass() {
        _classCallCheck(this, ChildNoBaseClass);
    }
    return _createClass(ChildNoBaseClass, [
        {
            key: "method2",
            value: function() {
            }
        }
    ]), ChildNoBaseClass;
}(), Grandchild = function(ChildNoBaseClass) {
    "use strict";
    function Grandchild() {
        return _classCallCheck(this, Grandchild), _possibleConstructorReturn(this, _getPrototypeOf(Grandchild).apply(this, arguments));
    }
    return _inherits(Grandchild, ChildNoBaseClass), Grandchild;
}(ChildNoBaseClass);
child.required, child.optional, child.additional, child.baseNumber, child.classNumber, child.baseMethod(), child.method(), grandchild.required, grandchild.optional, grandchild.additional2, grandchild.classString, grandchild.method2();
