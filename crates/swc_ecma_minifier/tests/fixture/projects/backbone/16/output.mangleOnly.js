export const obj = {
    remove: function(e, i) {
        var t = !_.isArray(e);
        e = t ? [
            e
        ] : _.clone(e);
        i || (i = {});
        var r, n, s, o;
        for(r = 0, n = e.length; r < n; r++){
            o = e[r] = this.get(e[r]);
            if (!o) continue;
            delete this._byId[o.id];
            delete this._byId[o.cid];
            s = this.indexOf(o);
            this.models.splice(s, 1);
            this.length--;
            if (!i.silent) {
                i.index = s;
                o.trigger("remove", o, this, i);
            }
            this._removeReference(o);
        }
        return t ? e[0] : e;
    }
};
