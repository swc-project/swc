class Scope {
    static units(defs) {
        return defs;
    }
    static module = (()=>{
        var _this = this;
        return function() {
            for(var _len = arguments.length, defs = new Array(_len), _key = 0; _key < _len; _key++){
                defs[_key] = arguments[_key];
            }
            return _this.units(defs);
        };
    })();
    instance = (()=>{
        var _this = this;
        return function() {
            for(var _len = arguments.length, defs = new Array(_len), _key = 0; _key < _len; _key++){
                defs[_key] = arguments[_key];
            }
            return _this.units(defs);
        };
    })();
    units(defs) {
        return defs;
    }
}
