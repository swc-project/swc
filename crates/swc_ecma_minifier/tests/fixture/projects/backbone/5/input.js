var Events = {
    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function (name, callback, context) {
        if (!eventsApi(this, "on", name, [callback, context]) || !callback)
            return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({
            callback: callback,
            context: context,
            ctx: context || this,
        });
        return this;
    },
};
