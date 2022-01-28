export const exported = {
    fireEvent: function(type, args, delay) {
        type = removeOn(type);
        var events = this.$events[type];
        return events && (args = Array.from(args), events.each(function(fn) {
            delay ? fn.delay(delay, this, args) : fn.apply(this, args);
        }, this)), this;
    }
};
