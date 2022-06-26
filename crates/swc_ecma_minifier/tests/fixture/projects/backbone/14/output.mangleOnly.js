export const obj = {
    set: function(a, b, c) {
        var d, e, f, g, h, i, j, k;
        if (a == null) return this;
        if (typeof a === "object") {
            e = a;
            c = b;
        } else {
            (e = {})[a] = b;
        }
        c || (c = {});
        if (!this._validate(e, c)) return false;
        f = c.unset;
        h = c.silent;
        g = [];
        i = this._changing;
        this._changing = true;
        if (!i) {
            this._previousAttributes = _.clone(this.attributes);
            this.changed = {};
        }
        (k = this.attributes), (j = this._previousAttributes);
        if (this.idAttribute in e) this.id = e[this.idAttribute];
        for(d in e){
            b = e[d];
            if (!_.isEqual(k[d], b)) g.push(d);
            if (!_.isEqual(j[d], b)) {
                this.changed[d] = b;
            } else {
                delete this.changed[d];
            }
            f ? delete k[d] : (k[d] = b);
        }
        if (!h) {
            if (g.length) this._pending = true;
            for(var l = 0, m = g.length; l < m; l++){
                this.trigger("change:" + g[l], this, k[g[l]], c);
            }
        }
        if (i) return this;
        if (!h) {
            while(this._pending){
                this._pending = false;
                this.trigger("change", this, c);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    }
};
