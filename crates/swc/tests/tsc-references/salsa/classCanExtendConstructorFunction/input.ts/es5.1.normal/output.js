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
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
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
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: first.js
/**
 * @constructor
 * @param {number} numberOxen
 */ function Wagon1(numberOxen) {
    this.numberOxen = numberOxen;
}
/** @param {Wagon[]=} wagons */ Wagon1.circle = function(wagons) {
    return wagons ? wagons.length : 3.14;
};
/** @param {*[]=} supplies - *[]= is my favourite type */ Wagon1.prototype.load = function(supplies) {
};
/** @param {*[]=} supplies - Yep, still a great type */ Wagon1.prototype.weight = function(supplies) {
    return supplies ? supplies.length : -1;
};
Wagon1.prototype.speed = function() {
    return this.numberOxen / this.weight();
};
var Sql = // ok
/*#__PURE__*/ function(Wagon) {
    "use strict";
    _inherits(Sql, Wagon);
    var _super = _createSuper(Sql);
    function Sql() {
        _classCallCheck(this, Sql);
        var _this;
        _this = _super.call(this); // error: not enough arguments
        _this.foonly = 12;
        return _this;
    }
    _createClass(Sql, [
        {
            /**
     * @param {Array.<string>} files
     * @param {"csv" | "json" | "xmlolololol"} format
     * This is not assignable, so should have a type error
     */ key: "load",
            value: function load(files, format) {
                if (format === "xmlolololol") {
                    throw new Error("please do not use XML. It was a joke.");
                } else {
                    _get(_getPrototypeOf(Sql.prototype), "speed", this).call(this); // run faster
                    if (_get(_getPrototypeOf(Sql.prototype), "weight", this).call(this) < 0) {
                    // ????????????????????????
                    }
                }
            }
        }
    ]);
    return Sql;
}(Wagon1);
var db = new Sql();
db.numberOxen = db.foonly;
var Drakkhen = // error, can't extend a TS constructor function
/*#__PURE__*/ function(Dragon) {
    "use strict";
    _inherits(Drakkhen, Dragon);
    var _super = _createSuper(Drakkhen);
    function Drakkhen() {
        _classCallCheck(this, Drakkhen);
        return _super.apply(this, arguments);
    }
    return Drakkhen;
}(Dragon1);
// @Filename: second.ts
/**
 * @constructor
 */ function Dragon1(numberEaten) {
    this.numberEaten = numberEaten;
}
var Firedrake = // error!
/*#__PURE__*/ function(Dragon) {
    "use strict";
    _inherits(Firedrake, Dragon);
    var _super = _createSuper(Firedrake);
    function Firedrake() {
        _classCallCheck(this, Firedrake);
        return _super.call(this);
    }
    return Firedrake;
}(Dragon1);
var Conestoga = // ok
/*#__PURE__*/ function(Wagon) {
    "use strict";
    _inherits(Conestoga, Wagon);
    var _super = _createSuper(Conestoga);
    function Conestoga(drunkOO) {
        _classCallCheck(this, Conestoga);
        var _this;
        _this = _super.call(this, 'nope');
        _this.drunkOO = drunkOO;
        return _this;
    }
    _createClass(Conestoga, null, [
        {
            key: "circle",
            value: // should error since others is not optional
            function circle(others) {
                return others.length;
            }
        }
    ]);
    return Conestoga;
}(Wagon1);
var c = new Conestoga(true);
c.drunkOO;
c.numberOxen;
// @Filename: generic.js
/**
 * @template T
 * @param {T} flavour
 */ function Soup1(flavour) {
    this.flavour = flavour;
}
var Chowder = /** @extends {Soup<{ claim: "ignorant" | "malicious" }>} */ /*#__PURE__*/ function(Soup) {
    "use strict";
    _inherits(Chowder, Soup);
    var _super = _createSuper(Chowder);
    function Chowder() {
        _classCallCheck(this, Chowder);
        return _super.apply(this, arguments);
    }
    _createClass(Chowder, [
        {
            key: "log",
            value: function log() {
                return this.flavour;
            }
        }
    ]);
    return Chowder;
}(Soup1);
var soup = new Soup1(1);
soup.flavour;
var chowder = new Chowder({
    claim: "ignorant"
});
chowder.flavour.claim;
var errorNoArgs = new Chowder();
var errorArgType = new Chowder(0);
