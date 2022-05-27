export const obj = {
    create: function(b, a) {
        a = a ? _.clone(a) : {};
        if (!(b = this._prepareModel(b, a))) return false;
        if (!a.wait) this.add(b, a);
        var c = this;
        var d = a.success;
        a.success = function(b, e, a) {
            if (a.wait) c.add(b, a);
            if (d) d(b, e, a);
        };
        b.save(null, a);
        return b;
    }
};
