//// [a.js]
function Multimap4() {
    this._map = {};
}
Multimap4.prototype = {
    get: function(key) {
        return this._map[key + ''];
    }
}, Multimap4.prototype["add-on"] = function() {}, Multimap4.prototype.addon = function() {}, Multimap4.prototype.__underscores__ = function() {};
var map4 = new Multimap4();
map4.get(""), map4["add-on"](), map4.addon(), map4.__underscores__();
