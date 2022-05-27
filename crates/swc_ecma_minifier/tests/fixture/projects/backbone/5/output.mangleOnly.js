var a = {
    on: function(a, b, c) {
        if (!eventsApi(this, "on", a, [
            b,
            c
        ]) || !b) return this;
        this._events || (this._events = {});
        var d = this._events[a] || (this._events[a] = []);
        d.push({
            callback: b,
            context: c,
            ctx: c || this
        });
        return this;
    }
};
