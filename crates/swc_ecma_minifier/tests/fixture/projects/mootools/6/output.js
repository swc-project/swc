export const obj = {
    removeEvents: function(events) {
        if ('object' == typeOf(events)) {
            for(type in events)this.removeEvent(type, events[type]);
            return this;
        }
        var type, attached = this.retrieve('events');
        if (!attached) return this;
        if (events) attached[events] && (attached[events].keys.each(function(fn) {
            this.removeEvent(events, fn);
        }, this), delete attached[events]);
        else {
            for(type in attached)this.removeEvents(type);
            this.eliminate('events');
        }
        return this;
    }
};
