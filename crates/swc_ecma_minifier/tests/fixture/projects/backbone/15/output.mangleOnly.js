export const obj = {
    changedAttributes: function(t) {
        if (!t) return this.hasChanged() ? _.clone(this.changed) : false;
        var i, e = false;
        var n = this._changing ? this._previousAttributes : this.attributes;
        for(var s in t){
            if (_.isEqual(n[s], (i = t[s]))) continue;
            (e || (e = {}))[s] = i;
        }
        return e;
    }
};
