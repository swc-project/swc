export const obj = {
    changedAttributes: function(a) {
        if (!a) return this.hasChanged() ? _.clone(this.changed) : false;
        var b, c = false;
        var d = this._changing ? this._previousAttributes : this.attributes;
        for(var e in a){
            if (_.isEqual(d[e], (b = a[e]))) continue;
            (c || (c = {}))[e] = b;
        }
        return c;
    }
};
