export const E = {
    set: function(t, e) {
        e = _.defaults({}, e, setOptions);
        if (e.parse) t = this.parse(t, e);
        var i = !_.isArray(t);
        t = i ? (t ? [
            t
        ] : []) : _.clone(t);
        var s, r, h, l, a, o, n;
        var f = e.at;
        var d = this.model;
        var g = this.comparator && f == null && e.sort !== false;
        var u = _.isString(this.comparator) ? this.comparator : null;
        var p = [], v = [], c = {};
        var m = e.add, $ = e.merge, b = e.remove;
        var y = !g && m && b ? [] : false;
        for(s = 0, r = t.length; s < r; s++){
            a = t[s];
            if (a instanceof Model) {
                h = l = a;
            } else {
                h = a[d.prototype.idAttribute];
            }
            if ((o = this.get(h))) {
                if (b) c[o.cid] = true;
                if ($) {
                    a = a === l ? l.attributes : a;
                    if (e.parse) a = o.parse(a, e);
                    o.set(a, e);
                    if (g && !n && o.hasChanged(u)) n = true;
                }
                t[s] = o;
            } else if (m) {
                l = t[s] = this._prepareModel(a, e);
                if (!l) continue;
                p.push(l);
                l.on("all", this._onModelEvent, this);
                this._byId[l.cid] = l;
                if (l.id != null) this._byId[l.id] = l;
            }
            if (y) y.push(o || l);
        }
        if (b) {
            for(s = 0, r = this.length; s < r; ++s){
                if (!c[(l = this.models[s]).cid]) v.push(l);
            }
            if (v.length) this.remove(v, e);
        }
        if (p.length || (y && y.length)) {
            if (g) n = true;
            this.length += p.length;
            if (f != null) {
                for(s = 0, r = p.length; s < r; s++){
                    this.models.splice(f + s, 0, p[s]);
                }
            } else {
                if (y) this.models.length = 0;
                var A = y || p;
                for(s = 0, r = A.length; s < r; s++){
                    this.models.push(A[s]);
                }
            }
        }
        if (n) this.sort({
            silent: true
        });
        if (!e.silent) {
            for(s = 0, r = p.length; s < r; s++){
                (l = p[s]).trigger("add", l, this, e);
            }
            if (n || (y && y.length)) this.trigger("sort", this, e);
        }
        return i ? t[0] : t;
    }
};
