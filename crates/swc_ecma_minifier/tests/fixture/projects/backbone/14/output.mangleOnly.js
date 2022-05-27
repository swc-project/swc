export const obj = {
    set: function(g, c, b) {
        var a, d, k, e, i, j, l, f;
        if (g == null) return this;
        if (typeof g === "object") {
            d = g;
            b = c;
        } else {
            (d = {})[g] = c;
        }
        b || (b = {});
        if (!this._validate(d, b)) return false;
        k = b.unset;
        i = b.silent;
        e = [];
        j = this._changing;
        this._changing = true;
        if (!j) {
            this._previousAttributes = _.clone(this.attributes);
            this.changed = {};
        }
        (f = this.attributes), (l = this._previousAttributes);
        if (this.idAttribute in d) this.id = d[this.idAttribute];
        for(a in d){
            c = d[a];
            if (!_.isEqual(f[a], c)) e.push(a);
            if (!_.isEqual(l[a], c)) {
                this.changed[a] = c;
            } else {
                delete this.changed[a];
            }
            k ? delete f[a] : (f[a] = c);
        }
        if (!i) {
            if (e.length) this._pending = true;
            for(var h = 0, m = e.length; h < m; h++){
                this.trigger("change:" + e[h], this, f[e[h]], b);
            }
        }
        if (j) return this;
        if (!i) {
            while(this._pending){
                this._pending = false;
                this.trigger("change", this, b);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    }
};
