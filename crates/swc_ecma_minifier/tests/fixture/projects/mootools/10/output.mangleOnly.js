export const exported = {
    fireEvent: function(e, t, r) {
        e = removeOn(e);
        var i = this.$events[e];
        if (!i) return this;
        t = Array.from(t);
        i.each(function(e) {
            if (r) e.delay(r, this, t);
            else e.apply(this, t);
        }, this);
        return this;
    }
};
