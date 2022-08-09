export const obj = {
    removeEvents: function(e) {
        var t;
        if (typeOf(e) == "object") {
            for(t in e)this.removeEvent(t, e[t]);
            return this;
        }
        var i = this.retrieve("events");
        if (!i) return this;
        if (!e) {
            for(t in i)this.removeEvents(t);
            this.eliminate("events");
        } else if (i[e]) {
            i[e].keys.each(function(t) {
                this.removeEvent(e, t);
            }, this);
            delete i[e];
        }
        return this;
    }
};
