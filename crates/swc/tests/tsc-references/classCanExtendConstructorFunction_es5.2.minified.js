import * as swcHelpers from "@swc/helpers";
function Wagon(numberOxen) {
    this.numberOxen = numberOxen;
}
Wagon.circle = function(wagons) {
    return wagons ? wagons.length : 3.14;
}, Wagon.prototype.load = function(supplies) {}, Wagon.prototype.weight = function(supplies) {
    return supplies ? supplies.length : -1;
}, Wagon.prototype.speed = function() {
    return this.numberOxen / this.weight();
};
var Sql = function(Wagon1) {
    "use strict";
    swcHelpers.inherits(Sql, Wagon1);
    var _super = swcHelpers.createSuper(Sql);
    function Sql() {
        var _this;
        return swcHelpers.classCallCheck(this, Sql), (_this = _super.call(this)).foonly = 12, _this;
    }
    return Sql.prototype.load = function(files, format) {
        if ("xmlolololol" === format) throw new Error("please do not use XML. It was a joke.");
        swcHelpers.get(swcHelpers.getPrototypeOf(Sql.prototype), "speed", this).call(this), swcHelpers.get(swcHelpers.getPrototypeOf(Sql.prototype), "weight", this).call(this);
    }, Sql;
}(Wagon), db = new Sql();
db.numberOxen = db.foonly;
var Drakkhen = function(Dragon1) {
    "use strict";
    swcHelpers.inherits(Drakkhen, Dragon1);
    var _super = swcHelpers.createSuper(Drakkhen);
    function Drakkhen() {
        return swcHelpers.classCallCheck(this, Drakkhen), _super.apply(this, arguments);
    }
    return Drakkhen;
}(Dragon);
function Dragon(numberEaten) {
    this.numberEaten = numberEaten;
}
var Firedrake = function(Dragon2) {
    "use strict";
    swcHelpers.inherits(Firedrake, Dragon2);
    var _super = swcHelpers.createSuper(Firedrake);
    function Firedrake() {
        return swcHelpers.classCallCheck(this, Firedrake), _super.call(this);
    }
    return Firedrake;
}(Dragon), Conestoga = function(Wagon2) {
    "use strict";
    swcHelpers.inherits(Conestoga, Wagon2);
    var _super = swcHelpers.createSuper(Conestoga);
    function Conestoga(drunkOO) {
        var _this;
        return swcHelpers.classCallCheck(this, Conestoga), (_this = _super.call(this, "nope")).drunkOO = drunkOO, _this;
    }
    return Conestoga.circle = function(others) {
        return others.length;
    }, Conestoga;
}(Wagon), c = new Conestoga(!0);
function Soup(flavour) {
    this.flavour = flavour;
}
c.drunkOO, c.numberOxen;
var Chowder = function(Soup1) {
    "use strict";
    swcHelpers.inherits(Chowder, Soup1);
    var _super = swcHelpers.createSuper(Chowder);
    function Chowder() {
        return swcHelpers.classCallCheck(this, Chowder), _super.apply(this, arguments);
    }
    return Chowder.prototype.log = function() {
        return this.flavour;
    }, Chowder;
}(Soup);
new Soup(1).flavour, new Chowder({
    claim: "ignorant"
}).flavour.claim, new Chowder(), new Chowder(0);
