function Multimap(ik, iv) {
    var obj, key, value;
    this._map = {
    }, obj = {
    }, key = ik, value = iv, key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, this._map2 = obj;
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
