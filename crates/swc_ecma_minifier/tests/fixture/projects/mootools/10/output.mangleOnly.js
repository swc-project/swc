export const exported = {
    fireEvent: function(a, b, c) {
        a = removeOn(a);
        var d = this.$events[a];
        if (!d) return this;
        b = Array.from(b);
        d.each(function(a) {
            if (c) a.delay(c, this, b);
            else a.apply(this, b);
        }, this);
        return this;
    }
};
