export const exported = {
    fireEvent: function(t, e, i) {
        t = removeOn(t);
        var n = this.$events[t];
        if (!n) return this;
        e = Array.from(e);
        n.each(function(t) {
            if (i) t.delay(i, this, e);
            else t.apply(this, e);
        }, this);
        return this;
    }
};
