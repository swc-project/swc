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
function Mixin(baseClass1) {
    var MixinClass = /*#__PURE__*/ function(baseClass) {
        "use strict";
        _inherits(MixinClass, baseClass);
        var _super = _createSuper(MixinClass);
        function MixinClass() {
            _classCallCheck(this, MixinClass);
            return _super.apply(this, arguments);
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
var ConcreteBase = /*#__PURE__*/ function() {
    "use strict";
    function ConcreteBase() {
        _classCallCheck(this, ConcreteBase);
    }
    _createClass(ConcreteBase, [
        {
            key: "baseMethod",
            value: function baseMethod() {
            }
        }
    ]);
    return ConcreteBase;
}();
var AbstractBase = function AbstractBase() {
    "use strict";
    _classCallCheck(this, AbstractBase);
};
var DerivedFromConcrete = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(DerivedFromConcrete, _super);
    var _super1 = _createSuper(DerivedFromConcrete);
    function DerivedFromConcrete() {
        _classCallCheck(this, DerivedFromConcrete);
        return _super1.apply(this, arguments);
    }
    return DerivedFromConcrete;
}(Mixin(ConcreteBase));
var wasConcrete = new DerivedFromConcrete();
wasConcrete.baseMethod();
wasConcrete.mixinMethod();
var DerivedFromAbstract = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(DerivedFromAbstract, _super);
    var _super2 = _createSuper(DerivedFromAbstract);
    function DerivedFromAbstract() {
        _classCallCheck(this, DerivedFromAbstract);
        return _super2.apply(this, arguments);
    }
    _createClass(DerivedFromAbstract, [
        {
            key: "abstractBaseMethod",
            value: function abstractBaseMethod() {
            }
        }
    ]);
    return DerivedFromAbstract;
}(Mixin(AbstractBase));
var wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod();
wasAbstract.mixinMethod();
