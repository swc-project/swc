export const obj = {
    removeEvents: function(a) {
        var b;
        if (typeOf(a) == "object") {
            for(b in a)this.removeEvent(b, a[b]);
            return this;
        }
        var c = this.retrieve("events");
        if (!c) return this;
        if (!a) {
            for(b in c)this.removeEvents(b);
            this.eliminate("events");
        } else if (c[a]) {
            c[a].keys.each(function(b) {
                this.removeEvent(a, b);
            }, this);
            delete c[a];
        }
        return this;
    }
};
