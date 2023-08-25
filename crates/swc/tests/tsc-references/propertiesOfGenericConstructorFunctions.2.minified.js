//// [propertiesOfGenericConstructorFunctions.js]
/**
 * @template {string} K
 * @template V
 * @param {string} ik
 * @param {V} iv
 */ import { _ as _define_property } from "@swc/helpers/_/_define_property";
function Multimap(ik, iv) {
    /** @type {{ [s: string]: V }} */ this._map = {}, // without type annotation
    this._map2 = _define_property({}, ik, iv);
}
/** @type {Multimap<"a" | "b", number>} with type annotation */ var map = new Multimap("a", 1), map2 = new Multimap("m", 2);
/**
 * @class
 * @template T
 * @param {T} t
 */ function Cp(t) {
    this.x = 1, this.y = t;
}
map._map.hi, map._map2.hi, map2._map.hi, map._map2.hi, Cp.prototype = {
    m1: function() {
        return this.x;
    },
    m2: function() {
        return this.z = this.x + 1, this.y;
    }
};
var cp = new Cp(1);
cp.x, cp.y, cp.m1(), cp.m2();
