//// [propertiesOfGenericConstructorFunctions.js]
import _define_property from "@swc/helpers/src/_define_property.mjs";
function Multimap(ik, iv) {
    this._map = {}, this._map2 = _define_property({}, ik, iv);
}
var map = new Multimap("a", 1), map2 = new Multimap("m", 2), n = map._map.hi, n = map._map2.hi, n = map2._map.hi, n = map._map2.hi;
function Cp(t) {
    this.x = 1, this.y = t;
}
Cp.prototype = {
    m1: function() {
        return this.x;
    },
    m2: function() {
        return this.z = this.x + 1, this.y;
    }
};
var cp = new Cp(1), n = cp.x, n = cp.y, n = cp.m1(), n = cp.m2();
