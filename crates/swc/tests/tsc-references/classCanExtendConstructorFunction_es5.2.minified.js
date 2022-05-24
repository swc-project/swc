import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
    _inherits(Sql, Wagon1);
    var _super = _create_super(Sql);
    function Sql() {
        var _this;
        return _class_call_check(this, Sql), (_this = _super.call(this)).foonly = 12, _this;
    }
    return Sql.prototype.load = function(files, format) {
        if ("xmlolololol" === format) throw new Error("please do not use XML. It was a joke.");
        _get(_get_prototype_of(Sql.prototype), "speed", this).call(this), _get(_get_prototype_of(Sql.prototype), "weight", this).call(this);
    }, Sql;
}(Wagon), db = new Sql();
db.numberOxen = db.foonly;
var Drakkhen = function(Dragon1) {
    "use strict";
    _inherits(Drakkhen, Dragon1);
    var _super = _create_super(Drakkhen);
    function Drakkhen() {
        return _class_call_check(this, Drakkhen), _super.apply(this, arguments);
    }
    return Drakkhen;
}(Dragon);
function Dragon(numberEaten) {
    this.numberEaten = numberEaten;
}
var Firedrake = function(Dragon2) {
    "use strict";
    _inherits(Firedrake, Dragon2);
    var _super = _create_super(Firedrake);
    function Firedrake() {
        return _class_call_check(this, Firedrake), _super.call(this);
    }
    return Firedrake;
}(Dragon), Conestoga = function(Wagon2) {
    "use strict";
    _inherits(Conestoga, Wagon2);
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
var Chowder = function(Soup1) {
    "use strict";
    _inherits(Chowder, Soup1);
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
