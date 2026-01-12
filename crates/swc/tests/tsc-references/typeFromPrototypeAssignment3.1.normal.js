//// [bug26885.js]
function Multimap3() {
    this._map = {};
}
Multimap3.prototype = {
    /**
     * @param {string} key
     * @returns {number} the value ok
     */ get: function get(key) {
        return this._map[key + ''];
    }
};
/** @type {Multimap3} */ var map = new Multimap3();
var n = map.get('hi');
