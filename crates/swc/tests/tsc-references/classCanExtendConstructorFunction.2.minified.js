//// [first.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
//// [second.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var c = new (function(Wagon1) {
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
//// [generic.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
function Soup(flavour) {
    this.flavour = flavour;
}
var Chowder = function(Soup) {
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
