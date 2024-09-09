//// [first.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
var db = new (/*#__PURE__*/ function(Wagon) {
    function Sql() {
        var _this;
        return _class_call_check(this, Sql), (_this = _call_super(this, Sql)).foonly = 12, _this;
    }
    return _inherits(Sql, Wagon), Sql.prototype.load = function(files, format) {
        if ("xmlolololol" === format) throw Error("please do not use XML. It was a joke.");
        _get(_get_prototype_of(Sql.prototype), "speed", this).call(this), _get(_get_prototype_of(Sql.prototype), "weight", this).call(this);
    }, Sql;
}(Wagon))();
db.numberOxen = db.foonly, /*#__PURE__*/ Dragon;
//// [second.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var c = new (/*#__PURE__*/ function(Wagon1) {
    function Conestoga(drunkOO) {
        var _this;
        return _class_call_check(this, Conestoga), (_this = _call_super(this, Conestoga, [
            'nope'
        ])).drunkOO = drunkOO, _this;
    }
    return _inherits(Conestoga, Wagon1), Conestoga.circle = function(others) {
        return others.length;
    }, Conestoga;
}(Wagon))(!0);
c.drunkOO, c.numberOxen;
//// [generic.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
function Soup(flavour) {
    this.flavour = flavour;
}
var Chowder = /*#__PURE__*/ function(Soup) {
    function Chowder() {
        return _class_call_check(this, Chowder), _call_super(this, Chowder, arguments);
    }
    return _inherits(Chowder, Soup), Chowder.prototype.log = function() {
        return this.flavour;
    }, Chowder;
}(Soup);
new Soup(1).flavour, new Chowder({
    claim: "ignorant"
}).flavour.claim, new Chowder(), new Chowder(0);
