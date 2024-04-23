//// [bug26885.js]
function Multimap3() {
    this._map = {};
}
Multimap3.prototype = {
    get: function(key) {
        return this._map[key + ''];
    }
}, new Multimap3().get('hi');
