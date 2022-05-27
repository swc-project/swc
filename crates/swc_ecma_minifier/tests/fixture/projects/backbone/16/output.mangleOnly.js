export const obj = {
    remove: function(a, c) {
        var f = !_.isArray(a);
        a = f ? [
            a
        ] : _.clone(a);
        c || (c = {});
        var d, g, e, b;
        for(d = 0, g = a.length; d < g; d++){
            b = a[d] = this.get(a[d]);
            if (!b) continue;
            delete this._byId[b.id];
            delete this._byId[b.cid];
            e = this.indexOf(b);
            this.models.splice(e, 1);
            this.length--;
            if (!c.silent) {
                c.index = e;
                b.trigger("remove", b, this, c);
            }
            this._removeReference(b);
        }
        return f ? a[0] : a;
    }
};
