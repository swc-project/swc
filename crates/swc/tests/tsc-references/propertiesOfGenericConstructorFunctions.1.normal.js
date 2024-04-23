//// [propertiesOfGenericConstructorFunctions.js]
/**
 * @template {string} K
 * @template V
 * @param {string} ik
 * @param {V} iv
 */ import { _ as _define_property } from "@swc/helpers/_/_define_property";
function Multimap(ik, iv) {
    /** @type {{ [s: string]: V }} */ this._map = {};
    // without type annotation
    this._map2 = _define_property({}, ik, iv);
}
/** @type {Multimap<"a" | "b", number>} with type annotation */ var map = new Multimap("a", 1);
// without type annotation
var map2 = new Multimap("m", 2);
/** @type {number} */ var n = map._map['hi'];
/** @type {number} */ var n = map._map2['hi'];
/** @type {number} */ var n = map2._map['hi'];
/** @type {number} */ var n = map._map2['hi'];
/**
 * @class
 * @template T
 * @param {T} t
 */ function Cp(t) {
    this.x = 1;
    this.y = t;
}
Cp.prototype = {
    m1: function m1() {
        return this.x;
    },
    m2: function m2() {
        this.z = this.x + 1;
        return this.y;
    }
};
var cp = new Cp(1);
/** @type {number} */ var n = cp.x;
/** @type {number} */ var n = cp.y;
/** @type {number} */ var n = cp.m1();
/** @type {number} */ var n = cp.m2();
