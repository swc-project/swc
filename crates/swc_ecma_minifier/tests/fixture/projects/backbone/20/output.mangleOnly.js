export const E = {
    set: function(t, e) {
        e = _.defaults({}, e, setOptions);
        if (e.parse) t = this.parse(t, e);
        var i = !_.isArray(t);
        t = i ? (t ? [
            t
        ] : []) : _.clone(t);
        var s, r, h, l, n, o, a;
        var f = e.at;
        var g = this.model;
        var d = this.comparator && f == null && e.sort !== false;
        var u = _.isString(this.comparator) ? this.comparator : null;
        var p = [], v = [], c = {};
        var m = e.add, $ = e.merge, b = e.remove;
        var y = !d && m && b ? [] : false;
        for(s = 0, r = t.length; s < r; s++){
            n = t[s];
            if (n instanceof Model) {
                h = l = n;
            } else {
                h = n[g.prototype.idAttribute];
            }
            if ((o = this.get(h))) {
                if (b) c[o.cid] = true;
                if ($) {
                    n = n === l ? l.attributes : n;
                    if (e.parse) n = o.parse(n, e);
                    o.set(n, e);
                    if (d && !a && o.hasChanged(u)) a = true;
                }
                t[s] = o;
            } else if (m) {
                l = t[s] = this._prepareModel(n, e);
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
            if (d) a = true;
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
        if (a) this.sort({
            silent: true
        });
        if (!e.silent) {
            for(s = 0, r = p.length; s < r; s++){
                (l = p[s]).trigger("add", l, this, e);
            }
            if (a || (y && y.length)) this.trigger("sort", this, e);
        }
        return i ? t[0] : t;
    }
};
