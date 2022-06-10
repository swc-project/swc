export const exported = {
    fireEvent: function(a, b, d) {
        a = removeOn(a);
        var c = this.$events[a];
        if (!c) return this;
        b = Array.from(b);
        c.each(function(a) {
            if (d) a.delay(d, this, b);
            else a.apply(this, b);
        }, this);
        return this;
    }
};
