export const obj = {
    removeEvents: function (
        events
    ) {
        var type;
        if ("object" == typeOf(
            events
        )) {
            for (type in events) this.removeEvent(
                type,
                events[type]
            );
            return this;
        }
        for (type in (events && (events = removeOn(
            events
        )), this.$events))
            if (!events || events == type)
                for (var fns = this.$events[type], i = fns.length; i--;)
                    i in fns && this.removeEvent(
                        type,
                        fns[i]
                    );
        return this;
    }
}