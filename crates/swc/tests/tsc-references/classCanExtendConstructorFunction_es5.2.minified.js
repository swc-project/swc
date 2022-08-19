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
var db = new (function(Wagon) {
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
}(Wagon))();
db.numberOxen = db.foonly, Dragon;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var c = new (function(Wagon1) {
    "use strict";
    _inherits(Conestoga, Wagon1);
    var _super = _create_super(Conestoga);
    function Conestoga(drunkOO) {
        var _this;
        return _class_call_check(this, Conestoga), (_this = _super.call(this, "nope")).drunkOO = drunkOO, _this;
    }
    return Conestoga.circle = function(others) {
        return others.length;
    }, Conestoga;
}(Wagon))(!0);
c.drunkOO, c.numberOxen;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function Soup(flavour) {
    this.flavour = flavour;
}
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
