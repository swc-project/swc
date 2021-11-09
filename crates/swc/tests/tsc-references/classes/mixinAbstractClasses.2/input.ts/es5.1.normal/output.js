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
function Mixin(baseClass1) {
    var MixinClass = // error expected: A mixin class that extends from a type variable containing an abstract construct signature must also be declared 'abstract'.
    /*#__PURE__*/ function(baseClass) {
        "use strict";
        _inherits(MixinClass, baseClass);
        function MixinClass() {
            _classCallCheck(this, MixinClass);
            return _possibleConstructorReturn(this, _getPrototypeOf(MixinClass).apply(this, arguments));
        }
        _createClass(MixinClass, [
            {
                key: "mixinMethod",
                value: function mixinMethod() {
                }
            }
        ]);
        return MixinClass;
    }(baseClass1);
    return MixinClass;
}
var AbstractBase = function AbstractBase() {
    "use strict";
    _classCallCheck(this, AbstractBase);
};
var MixedBase1 = Mixin(AbstractBase);
var DerivedFromAbstract = // error expected: Non-abstract class 'DerivedFromAbstract' does not implement inherited abstract member 'abstractBaseMethod' from class 'AbstractBase & Mixin'.
/*#__PURE__*/ function(MixedBase) {
    "use strict";
    _inherits(DerivedFromAbstract, MixedBase);
    function DerivedFromAbstract() {
        _classCallCheck(this, DerivedFromAbstract);
        return _possibleConstructorReturn(this, _getPrototypeOf(DerivedFromAbstract).apply(this, arguments));
    }
    return DerivedFromAbstract;
}(MixedBase1);
// error expected: Cannot create an instance of an abstract class.
new MixedBase1();
