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
// @filename: index4.js
import Fab from "./index3";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index1.js
export default 12;
// @filename: index2.js
export default function foo() {
    return foo;
};
export var x = foo;
export { foo as bar };
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
    this.a = /** @type {Foo} */ (null);
};
// @filename: index3.js
export { Foo as default };
export var X = Foo;
export { Foo as Bar };
var Bar = /*#__PURE__*/ function(Fab1) {
    "use strict";
    _inherits(Bar, Fab1);
    var _super = _createSuper(Bar);
    function Bar() {
        _classCallCheck(this, Bar);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = /** @type {Bar} */ (null);
        return _this;
    }
    return Bar;
}(Fab);
export default Bar;
// @filename: index5.js
// merge type alias and const (OK)
export default 12;
/**
 * @typedef {string | number} default
 */ // @filename: index6.js
// merge type alias and function (OK)
export default function func() {};
