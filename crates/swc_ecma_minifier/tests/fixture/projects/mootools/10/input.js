export const exported = {
    fireEvent: function (type, args, delay) {
        type = removeOn(type);
        var events = this.$events[type];
        if (!events) return this;
        args = Array.from(args);
        events.each(function (fn) {
            if (delay) fn.delay(delay, this, args);
            else fn.apply(this, args);
        }, this);
        return this;
    },
};
