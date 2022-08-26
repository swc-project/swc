var t = {
    on: function(t, s, e) {
        if (!eventsApi(this, "on", t, [
            s,
            e
        ]) || !s) return this;
        this._events || (this._events = {});
        var n = this._events[t] || (this._events[t] = []);
        n.push({
            callback: s,
            context: e,
            ctx: e || this
        });
        return this;
    }
};
