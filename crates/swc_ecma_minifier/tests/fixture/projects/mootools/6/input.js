export const obj = {
    removeEvents: function (events) {
        var type;
        if (typeOf(events) == 'object') {
            for (type in events) this.removeEvent(type, events[type]);
            return this;
        }
        var attached = this.retrieve('events');
        if (!attached) return this;
        if (!events) {
            for (type in attached) this.removeEvents(type);
            this.eliminate('events');
        } else if (attached[events]) {
            attached[events].keys.each(function (fn) {
                this.removeEvent(events, fn);
            }, this);
            delete attached[events];
        }
        return this;
    },
}