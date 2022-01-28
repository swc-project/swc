var Events = {
    on: function(name, callback, context) {
        return eventsApi(this, "on", name, [
            callback,
            context
        ]) && callback && (this._events || (this._events = {}), (this._events[name] || (this._events[name] = [])).push({
            callback: callback,
            context: context,
            ctx: context || this
        })), this;
    }
};
