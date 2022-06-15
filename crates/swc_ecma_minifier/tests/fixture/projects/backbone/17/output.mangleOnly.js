export const obj = {
    create: function(a, b) {
        b = b ? _.clone(b) : {};
        if (!(a = this._prepareModel(a, b))) return false;
        if (!b.wait) this.add(a, b);
        var c = this;
        var d = b.success;
        b.success = function(a, b, e) {
            if (e.wait) c.add(a, e);
            if (d) d(a, b, e);
        };
        a.save(null, b);
        return a;
    }
};
