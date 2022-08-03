export const obj = {
    create: function(e, s) {
        s = s ? _.clone(s) : {};
        if (!(e = this._prepareModel(e, s))) return false;
        if (!s.wait) this.add(e, s);
        var t = this;
        var i = s.success;
        s.success = function(e, s, a) {
            if (a.wait) t.add(e, a);
            if (i) i(e, s, a);
        };
        e.save(null, s);
        return e;
    }
};
