export const E = {
    set: function(d, b) {
        b = _.defaults({}, b, setOptions);
        if (b.parse) d = this.parse(d, b);
        var p = !_.isArray(d);
        d = p ? (d ? [
            d
        ] : []) : _.clone(d);
        var a, f, k, c, e, i, j;
        var l = b.at;
        var t = this.model;
        var m = this.comparator && l == null && b.sort !== false;
        var u = _.isString(this.comparator) ? this.comparator : null;
        var g = [], n = [], q = {};
        var r = b.add, v = b.merge, o = b.remove;
        var h = !m && r && o ? [] : false;
        for(a = 0, f = d.length; a < f; a++){
            e = d[a];
            if (e instanceof Model) {
                k = c = e;
            } else {
                k = e[t.prototype.idAttribute];
            }
            if ((i = this.get(k))) {
                if (o) q[i.cid] = true;
                if (v) {
                    e = e === c ? c.attributes : e;
                    if (b.parse) e = i.parse(e, b);
                    i.set(e, b);
                    if (m && !j && i.hasChanged(u)) j = true;
                }
                d[a] = i;
            } else if (r) {
                c = d[a] = this._prepareModel(e, b);
                if (!c) continue;
                g.push(c);
                c.on("all", this._onModelEvent, this);
                this._byId[c.cid] = c;
                if (c.id != null) this._byId[c.id] = c;
            }
            if (h) h.push(i || c);
        }
        if (o) {
            for(a = 0, f = this.length; a < f; ++a){
                if (!q[(c = this.models[a]).cid]) n.push(c);
            }
            if (n.length) this.remove(n, b);
        }
        if (g.length || (h && h.length)) {
            if (m) j = true;
            this.length += g.length;
            if (l != null) {
                for(a = 0, f = g.length; a < f; a++){
                    this.models.splice(l + a, 0, g[a]);
                }
            } else {
                if (h) this.models.length = 0;
                var s = h || g;
                for(a = 0, f = s.length; a < f; a++){
                    this.models.push(s[a]);
                }
            }
        }
        if (j) this.sort({
            silent: true
        });
        if (!b.silent) {
            for(a = 0, f = g.length; a < f; a++){
                (c = g[a]).trigger("add", c, this, b);
            }
            if (j || (h && h.length)) this.trigger("sort", this, b);
        }
        return p ? d[0] : d;
    }
};
