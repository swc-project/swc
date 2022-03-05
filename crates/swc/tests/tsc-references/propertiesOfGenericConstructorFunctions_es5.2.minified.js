import * as swcHelpers from "@swc/helpers";
function Multimap(ik, iv) {
    this._map = {}, this._map2 = swcHelpers.defineProperty({}, ik, iv);
}
var map = new Multimap("a", 1), map2 = new Multimap("m", 2);
function Cp(t) {
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
