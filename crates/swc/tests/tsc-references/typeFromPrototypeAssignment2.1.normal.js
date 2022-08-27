//// [a.js]
// non top-level:
// all references to _map, set, get, addon should be ok
(function container() {
    /** @constructor */ var Multimap = function Multimap() {
        this._map = {};
        this._map;
        this.set;
        this.get;
        this.addon;
    };
    Multimap.prototype = {
        set: function set() {
            this._map;
            this.set;
            this.get;
            this.addon;
        },
        get: function get() {
            this._map;
            this.set;
            this.get;
            this.addon;
        }
    };
    Multimap.prototype.addon = function() {
        this._map;
        this.set;
        this.get;
        this.addon;
    };
    var mm = new Multimap();
    mm._map;
    mm.set;
    mm.get;
    mm.addon;
});
