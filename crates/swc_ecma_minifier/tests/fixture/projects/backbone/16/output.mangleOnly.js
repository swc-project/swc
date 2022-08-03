export const obj = {
    remove: function(e, i) {
        var t = !_.isArray(e);
        e = t ? [
            e
        ] : _.clone(e);
        i || (i = {});
        var n, r, s, h;
        for(n = 0, r = e.length; n < r; n++){
            h = e[n] = this.get(e[n]);
            if (!h) continue;
            delete this._byId[h.id];
            delete this._byId[h.cid];
            s = this.indexOf(h);
            this.models.splice(s, 1);
            this.length--;
            if (!i.silent) {
                i.index = s;
                h.trigger("remove", h, this, i);
            }
            this._removeReference(h);
        }
        return t ? e[0] : e;
    }
};
