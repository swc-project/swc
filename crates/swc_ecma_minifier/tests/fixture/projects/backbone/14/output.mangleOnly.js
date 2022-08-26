export const obj = {
    set: function(i, t, e) {
        var s, h, n, r, g, a, u, f;
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
        g = e.silent;
        r = [];
        a = this._changing;
        this._changing = true;
        if (!a) {
            this._previousAttributes = _.clone(this.attributes);
            this.changed = {};
        }
        (f = this.attributes), (u = this._previousAttributes);
        if (this.idAttribute in h) this.id = h[this.idAttribute];
        for(s in h){
            t = h[s];
            if (!_.isEqual(f[s], t)) r.push(s);
            if (!_.isEqual(u[s], t)) {
                this.changed[s] = t;
            } else {
                delete this.changed[s];
            }
            n ? delete f[s] : (f[s] = t);
        }
        if (!g) {
            if (r.length) this._pending = true;
            for(var l = 0, d = r.length; l < d; l++){
                this.trigger("change:" + r[l], this, f[r[l]], e);
            }
        }
        if (a) return this;
        if (!g) {
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
