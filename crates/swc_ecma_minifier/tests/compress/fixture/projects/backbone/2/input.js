function foo() {
    if (!eventsApi(this, "on", name, [callback, context]) || !callback)
        return this;
    return (
        this._events || (this._events = {}),
        (this._events[name] || (this._events[name] = [])).push({
            callback: callback,
            context: context,
            ctx: context || this,
        }),
        this
    );
}