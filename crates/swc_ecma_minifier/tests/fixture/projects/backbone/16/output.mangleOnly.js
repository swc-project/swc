export const obj = {
    remove: function(a, b) {
        var c = !_.isArray(a);
        a = c ? [
            a
        ] : _.clone(a);
        b || (b = {});
        var d, e, f, g;
        for(d = 0, e = a.length; d < e; d++){
            g = a[d] = this.get(a[d]);
            if (!g) continue;
            delete this._byId[g.id];
            delete this._byId[g.cid];
            f = this.indexOf(g);
            this.models.splice(f, 1);
            this.length--;
            if (!b.silent) {
                b.index = f;
                g.trigger("remove", g, this, b);
            }
            this._removeReference(g);
        }
        return c ? a[0] : a;
    }
};
