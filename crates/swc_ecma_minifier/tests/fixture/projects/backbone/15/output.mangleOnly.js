export const obj = {
    changedAttributes: function(a) {
        if (!a) return this.hasChanged() ? _.clone(this.changed) : false;
        var d, b = false;
        var e = this._changing ? this._previousAttributes : this.attributes;
        for(var c in a){
            if (_.isEqual(e[c], (d = a[c]))) continue;
            (b || (b = {}))[c] = d;
        }
        return b;
    }
};
