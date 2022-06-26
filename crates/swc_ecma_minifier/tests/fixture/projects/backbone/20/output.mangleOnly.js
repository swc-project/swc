export const E = {
    set: function(a, b) {
        b = _.defaults({}, b, setOptions);
        if (b.parse) a = this.parse(a, b);
        var c = !_.isArray(a);
        a = c ? (a ? [
            a
        ] : []) : _.clone(a);
        var d, e, f, g, h, i, j;
        var k = b.at;
        var l = this.model;
        var m = this.comparator && k == null && b.sort !== false;
        var n = _.isString(this.comparator) ? this.comparator : null;
        var o = [], p = [], q = {};
        var r = b.add, s = b.merge, t = b.remove;
        var u = !m && r && t ? [] : false;
        for(d = 0, e = a.length; d < e; d++){
            h = a[d];
            if (h instanceof Model) {
                f = g = h;
            } else {
                f = h[l.prototype.idAttribute];
            }
            if ((i = this.get(f))) {
                if (t) q[i.cid] = true;
                if (s) {
                    h = h === g ? g.attributes : h;
                    if (b.parse) h = i.parse(h, b);
                    i.set(h, b);
                    if (m && !j && i.hasChanged(n)) j = true;
                }
                a[d] = i;
            } else if (r) {
                g = a[d] = this._prepareModel(h, b);
                if (!g) continue;
                o.push(g);
                g.on("all", this._onModelEvent, this);
                this._byId[g.cid] = g;
                if (g.id != null) this._byId[g.id] = g;
            }
            if (u) u.push(i || g);
        }
        if (t) {
            for(d = 0, e = this.length; d < e; ++d){
                if (!q[(g = this.models[d]).cid]) p.push(g);
            }
            if (p.length) this.remove(p, b);
        }
        if (o.length || (u && u.length)) {
            if (m) j = true;
            this.length += o.length;
            if (k != null) {
                for(d = 0, e = o.length; d < e; d++){
                    this.models.splice(k + d, 0, o[d]);
                }
            } else {
                if (u) this.models.length = 0;
                var v = u || o;
                for(d = 0, e = v.length; d < e; d++){
                    this.models.push(v[d]);
                }
            }
        }
        if (j) this.sort({
            silent: true
        });
        if (!b.silent) {
            for(d = 0, e = o.length; d < e; d++){
                (g = o[d]).trigger("add", g, this, b);
            }
            if (j || (u && u.length)) this.trigger("sort", this, b);
        }
        return c ? a[0] : a;
    }
};
