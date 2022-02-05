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
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
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
function _superPropBase(object1, property) {
    while(!Object.prototype.hasOwnProperty.call(object1, property)){
        object1 = _getPrototypeOf(object1);
        if (object1 === null) break;
    }
    return object1;
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
// @noEmit: true
// @allowJs: true
// @filename: spellingUncheckedJS.js
export var inModule = 1;
inmodule.toFixed();
function f() {
    // @ts-expect-error
    "this is fine";
    var locals = 2 + true;
    locale.toFixed();
    // @ts-expect-error
    localf.toExponential();
}
var Classe = /*#__PURE__*/ function() {
    "use strict";
    function Classe() {
        _classCallCheck(this, Classe);
        this.non = 'oui';
    }
    _createClass(Classe, [
        {
            key: "methode",
            value: function methode() {
                // no error on 'this' references
                return this.none;
            }
        }
    ]);
    return Classe;
}();
var Derivee = /*#__PURE__*/ function(Classe) {
    "use strict";
    _inherits(Derivee, Classe);
    var _super = _createSuper(Derivee);
    function Derivee() {
        _classCallCheck(this, Derivee);
        return _super.apply(this, arguments);
    }
    _createClass(Derivee, [
        {
            key: "methode",
            value: function methode() {
                // no error on 'super' references
                return _get(_getPrototypeOf(Derivee.prototype), "none", this);
            }
        }
    ]);
    return Derivee;
}(Classe);
var object = {
    spaaace: 3
};
object.spaaaace // error on read
;
object.spaace = 12 // error on write
;
object.fresh = 12 // OK
;
other.puuuce // OK, from another file
;
new Date().getGMTDate() // OK, from another file
;
// No suggestions for globals from other files
var atoc = setIntegral(function() {
    return console.log('ok');
}, 500);
AudioBuffin // etc
;
Jimmy;
Jon;
// @filename: other.js
var Jimmy = 1;
var John = 2;
Jon // error, it's from the same file
;
var other = {
    puuce: 4
};
