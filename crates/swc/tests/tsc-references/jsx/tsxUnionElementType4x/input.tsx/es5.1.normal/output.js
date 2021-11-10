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
// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var RC1 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(RC1, _Component);
    var _super = _createSuper(RC1);
    function RC1() {
        _classCallCheck(this, RC1);
        return _super.apply(this, arguments);
    }
    _createClass(RC1, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        }
    ]);
    return RC1;
}(React.Component);
var RC2 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(RC2, _Component);
    var _super = _createSuper(RC2);
    function RC2() {
        _classCallCheck(this, RC2);
        return _super.apply(this, arguments);
    }
    _createClass(RC2, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        },
        {
            key: "method",
            value: function method() {
            }
        }
    ]);
    return RC2;
}(React.Component);
var RC3 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(RC3, _Component);
    var _super = _createSuper(RC3);
    function RC3() {
        _classCallCheck(this, RC3);
        return _super.apply(this, arguments);
    }
    _createClass(RC3, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        }
    ]);
    return RC3;
}(React.Component);
var RC4 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(RC4, _Component);
    var _super = _createSuper(RC4);
    function RC4() {
        _classCallCheck(this, RC4);
        return _super.apply(this, arguments);
    }
    _createClass(RC4, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        }
    ]);
    return RC4;
}(React.Component);
var RCComp = RC1 || RC2;
var EmptyRCComp = RC3 || RC4;
var PartRCComp = RC1 || RC4;
// Error
var a = /*#__PURE__*/ React.createElement(RCComp, {
    x: true
});
var b = /*#__PURE__*/ React.createElement(PartRCComp, {
    x: 10
});
var c = /*#__PURE__*/ React.createElement(EmptyRCComp, {
    prop: true
});
export { };
