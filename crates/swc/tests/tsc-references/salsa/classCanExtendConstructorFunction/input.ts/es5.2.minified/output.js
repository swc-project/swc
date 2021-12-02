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
function _get(target, property, receiver) {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (base) {
            var desc = Object.getOwnPropertyDescriptor(base, property);
            return desc.get ? desc.get.call(receiver) : desc.value;
        }
    }, _get(target, property, receiver || target);
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
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
        } catch (e) {
            return !1;
        }
    }();
    return function() {
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    };
}
function Wagon(numberOxen) {
    this.numberOxen = numberOxen;
}
Wagon.circle = function(wagons) {
    return wagons ? wagons.length : 3.14;
}, Wagon.prototype.load = function(supplies) {
}, Wagon.prototype.weight = function(supplies) {
    return supplies ? supplies.length : -1;
}, Wagon.prototype.speed = function() {
    return this.numberOxen / this.weight();
};
var Sql = function(Wagon1) {
    "use strict";
    _inherits(Sql, Wagon1);
    var _super = _createSuper(Sql);
    function Sql() {
        var _this;
        return _classCallCheck(this, Sql), (_this = _super.call(this)).foonly = 12, _this;
    }
    return _createClass(Sql, [
        {
            key: "load",
            value: function(files, format) {
                if ("xmlolololol" === format) throw new Error("please do not use XML. It was a joke.");
                _get(_getPrototypeOf(Sql.prototype), "speed", this).call(this), 0 > _get(_getPrototypeOf(Sql.prototype), "weight", this).call(this);
            }
        }
    ]), Sql;
}(Wagon), db = new Sql();
db.numberOxen = db.foonly;
var Drakkhen = function(Dragon1) {
    "use strict";
    _inherits(Drakkhen, Dragon1);
    var _super = _createSuper(Drakkhen);
    function Drakkhen() {
        return _classCallCheck(this, Drakkhen), _super.apply(this, arguments);
    }
    return Drakkhen;
}(Dragon);
function Dragon(numberEaten) {
    this.numberEaten = numberEaten;
}
var Firedrake = function(Dragon2) {
    "use strict";
    _inherits(Firedrake, Dragon2);
    var _super = _createSuper(Firedrake);
    function Firedrake() {
        return _classCallCheck(this, Firedrake), _super.call(this);
    }
    return Firedrake;
}(Dragon), Conestoga = function(Wagon2) {
    "use strict";
    _inherits(Conestoga, Wagon2);
    var _super = _createSuper(Conestoga);
    function Conestoga(drunkOO) {
        var _this;
        return _classCallCheck(this, Conestoga), (_this = _super.call(this, "nope")).drunkOO = drunkOO, _this;
    }
    return _createClass(Conestoga, null, [
        {
            key: "circle",
            value: function(others) {
                return others.length;
            }
        }
    ]), Conestoga;
}(Wagon), c = new Conestoga(!0);
function Soup(flavour) {
    this.flavour = flavour;
}
c.drunkOO, c.numberOxen;
var Chowder = function(Soup1) {
    "use strict";
    _inherits(Chowder, Soup1);
    var _super = _createSuper(Chowder);
    function Chowder() {
        return _classCallCheck(this, Chowder), _super.apply(this, arguments);
    }
    return _createClass(Chowder, [
        {
            key: "log",
            value: function() {
                return this.flavour;
            }
        }
    ]), Chowder;
}(Soup);
new Soup(1).flavour, new Chowder({
    claim: "ignorant"
}).flavour.claim, new Chowder(), new Chowder(0);
