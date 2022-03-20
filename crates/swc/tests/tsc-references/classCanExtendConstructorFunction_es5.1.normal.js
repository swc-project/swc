import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: first.js
/**
 * @constructor
 * @param {number} numberOxen
 */ function Wagon(numberOxen) {
    this.numberOxen = numberOxen;
}
/** @param {Wagon[]=} wagons */ Wagon.circle = function(wagons) {
    return wagons ? wagons.length : 3.14;
};
/** @param {*[]=} supplies - *[]= is my favourite type */ Wagon.prototype.load = function(supplies) {};
/** @param {*[]=} supplies - Yep, still a great type */ Wagon.prototype.weight = function(supplies) {
    return supplies ? supplies.length : -1;
};
Wagon.prototype.speed = function() {
    return this.numberOxen / this.weight();
};
// ok
var Sql = /*#__PURE__*/ function(Wagon1) {
    "use strict";
    swcHelpers.inherits(Sql, Wagon1);
    var _super = swcHelpers.createSuper(Sql);
    function Sql() {
        swcHelpers.classCallCheck(this, Sql);
        var _this;
        _this = _super.call(this); // error: not enough arguments
        _this.foonly = 12;
        return _this;
    }
    var _proto = Sql.prototype;
    /**
     * @param {Array.<string>} files
     * @param {"csv" | "json" | "xmlolololol"} format
     * This is not assignable, so should have a type error
     */ _proto.load = function load(files, format) {
        if (format === "xmlolololol") {
            throw new Error("please do not use XML. It was a joke.");
        } else {
            swcHelpers.get(swcHelpers.getPrototypeOf(Sql.prototype), "speed", this).call(this); // run faster
            if (swcHelpers.get(swcHelpers.getPrototypeOf(Sql.prototype), "weight", this).call(this) < 0) {
            // ????????????????????????
            }
        }
    };
    return Sql;
}(Wagon);
var db = new Sql();
db.numberOxen = db.foonly;
// error, can't extend a TS constructor function
var Drakkhen = /*#__PURE__*/ function(Dragon1) {
    "use strict";
    swcHelpers.inherits(Drakkhen, Dragon1);
    var _super = swcHelpers.createSuper(Drakkhen);
    function Drakkhen() {
        swcHelpers.classCallCheck(this, Drakkhen);
        return _super.apply(this, arguments);
    }
    return Drakkhen;
}(Dragon);
// @Filename: second.ts
/**
 * @constructor
 */ function Dragon(numberEaten) {
    this.numberEaten = numberEaten;
}
// error!
var Firedrake = /*#__PURE__*/ function(Dragon2) {
    "use strict";
    swcHelpers.inherits(Firedrake, Dragon2);
    var _super = swcHelpers.createSuper(Firedrake);
    function Firedrake() {
        swcHelpers.classCallCheck(this, Firedrake);
        return _super.call(this);
    }
    return Firedrake;
}(Dragon);
// ok
var Conestoga = /*#__PURE__*/ function(Wagon2) {
    "use strict";
    swcHelpers.inherits(Conestoga, Wagon2);
    var _super = swcHelpers.createSuper(Conestoga);
    function Conestoga(drunkOO) {
        swcHelpers.classCallCheck(this, Conestoga);
        var _this;
        _this = _super.call(this, "nope");
        _this.drunkOO = drunkOO;
        return _this;
    }
    // should error since others is not optional
    Conestoga.circle = function circle(others) {
        return others.length;
    };
    return Conestoga;
}(Wagon);
var c = new Conestoga(true);
c.drunkOO;
c.numberOxen;
// @Filename: generic.js
/**
 * @template T
 * @param {T} flavour
 */ function Soup(flavour) {
    this.flavour = flavour;
}
/** @extends {Soup<{ claim: "ignorant" | "malicious" }>} */ var Chowder = /*#__PURE__*/ function(Soup1) {
    "use strict";
    swcHelpers.inherits(Chowder, Soup1);
    var _super = swcHelpers.createSuper(Chowder);
    function Chowder() {
        swcHelpers.classCallCheck(this, Chowder);
        return _super.apply(this, arguments);
    }
    var _proto = Chowder.prototype;
    _proto.log = function log() {
        return this.flavour;
    };
    return Chowder;
}(Soup);
var soup = new Soup(1);
soup.flavour;
var chowder = new Chowder({
    claim: "ignorant"
});
chowder.flavour.claim;
var errorNoArgs = new Chowder();
var errorArgType = new Chowder(0);
