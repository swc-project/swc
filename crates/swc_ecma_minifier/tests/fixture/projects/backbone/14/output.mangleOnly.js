export const obj = {
    set: function(i, t, e) {
        var s, h, n, r, u, f, g, a;
        if (i == null) return this;
        if (typeof i === "object") {
            h = i;
            e = t;
        } else {
            (h = {})[i] = t;
        }
        e || (e = {});
        if (!this._validate(h, e)) return false;
        n = e.unset;
        u = e.silent;
        r = [];
        f = this._changing;
        this._changing = true;
        if (!f) {
            this._previousAttributes = _.clone(this.attributes);
            this.changed = {};
        }
        (a = this.attributes), (g = this._previousAttributes);
        if (this.idAttribute in h) this.id = h[this.idAttribute];
        for(s in h){
            t = h[s];
            if (!_.isEqual(a[s], t)) r.push(s);
            if (!_.isEqual(g[s], t)) {
                this.changed[s] = t;
            } else {
                delete this.changed[s];
            }
            n ? delete a[s] : (a[s] = t);
        }
        if (!u) {
            if (r.length) this._pending = true;
            for(var l = 0, d = r.length; l < d; l++){
                this.trigger("change:" + r[l], this, a[r[l]], e);
            }
        }
        if (f) return this;
        if (!u) {
            while(this._pending){
                this._pending = false;
                this.trigger("change", this, e);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    }
};
