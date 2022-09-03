//// [bug26885.js]
function Multimap3() {
    this._map = {};
}
Multimap3.prototype = {
    get: function(key) {
        return this._map[key + ""];
    }
};
var map = new Multimap3(), n = map.get("hi");
