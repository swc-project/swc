import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
var Sql = function(Wagon) {
    "use strict";
    _inherits(Sql, Wagon);
    var _super = _create_super(Sql);
    function Sql() {
        var _this;
        return _class_call_check(this, Sql), (_this = _super.call(this)).foonly = 12, _this;
    }
    return Sql.prototype.load = function(files, format) {
        if ("xmlolololol" === format) throw Error("please do not use XML. It was a joke.");
        _get(_get_prototype_of(Sql.prototype), "speed", this).call(this), _get(_get_prototype_of(Sql.prototype), "weight", this).call(this);
    }, Sql;
}(Wagon), db = new Sql();
db.numberOxen = db.foonly;
var Drakkhen = function(Dragon) {
    "use strict";
    _inherits(Drakkhen, Dragon);
    var _super = _create_super(Drakkhen);
    function Drakkhen() {
        return _class_call_check(this, Drakkhen), _super.apply(this, arguments);
    }
    return Drakkhen;
}(Dragon);
function Dragon(numberEaten) {
    this.numberEaten = numberEaten;
}
var Firedrake = function(Dragon) {
    "use strict";
    _inherits(Firedrake, Dragon);
    var _super = _create_super(Firedrake);
    function Firedrake() {
        return _class_call_check(this, Firedrake), _super.call(this);
    }
    return Firedrake;
}(Dragon), Conestoga = function(Wagon) {
    "use strict";
    _inherits(Conestoga, Wagon);
    var _super = _create_super(Conestoga);
    function Conestoga(drunkOO) {
        var _this;
        return _class_call_check(this, Conestoga), (_this = _super.call(this, "nope")).drunkOO = drunkOO, _this;
    }
    return Conestoga.circle = function(others) {
        return others.length;
    }, Conestoga;
}(Wagon), c = new Conestoga(!0);
function Soup(flavour) {
    this.flavour = flavour;
}
c.drunkOO, c.numberOxen;
var Chowder = function(Soup) {
    "use strict";
    _inherits(Chowder, Soup);
    var _super = _create_super(Chowder);
    function Chowder() {
        return _class_call_check(this, Chowder), _super.apply(this, arguments);
    }
    return Chowder.prototype.log = function() {
        return this.flavour;
    }, Chowder;
}(Soup);
new Soup(1).flavour, new Chowder({
    claim: "ignorant"
}).flavour.claim, new Chowder(), new Chowder(0);
