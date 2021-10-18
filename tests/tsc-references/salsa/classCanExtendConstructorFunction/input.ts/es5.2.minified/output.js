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
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
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
var Sql = function(Wagon) {
    "use strict";
    function Sql() {
        var _this;
        return _classCallCheck(this, Sql), (_this = _possibleConstructorReturn(this, _getPrototypeOf(Sql).call(this))).foonly = 12, _this;
    }
    return _inherits(Sql, Wagon), _createClass(Sql, [
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
var Drakkhen = function(Dragon) {
    "use strict";
    function Drakkhen() {
        return _classCallCheck(this, Drakkhen), _possibleConstructorReturn(this, _getPrototypeOf(Drakkhen).apply(this, arguments));
    }
    return _inherits(Drakkhen, Dragon), Drakkhen;
}(Dragon);
function Dragon(numberEaten) {
    this.numberEaten = numberEaten;
}
var Firedrake = function(Dragon) {
    "use strict";
    function Firedrake() {
        return _classCallCheck(this, Firedrake), _possibleConstructorReturn(this, _getPrototypeOf(Firedrake).call(this));
    }
    return _inherits(Firedrake, Dragon), Firedrake;
}(Dragon), Conestoga = function(Wagon) {
    "use strict";
    function Conestoga(drunkOO) {
        var _this;
        return _classCallCheck(this, Conestoga), (_this = _possibleConstructorReturn(this, _getPrototypeOf(Conestoga).call(this, "nope"))).drunkOO = drunkOO, _this;
    }
    return _inherits(Conestoga, Wagon), _createClass(Conestoga, null, [
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
var Chowder = function(Soup) {
    "use strict";
    function Chowder() {
        return _classCallCheck(this, Chowder), _possibleConstructorReturn(this, _getPrototypeOf(Chowder).apply(this, arguments));
    }
    return _inherits(Chowder, Soup), _createClass(Chowder, [
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
