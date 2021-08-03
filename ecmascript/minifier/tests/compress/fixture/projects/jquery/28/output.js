export const E = {
    queue: function(elem, type, data) {
        var queue;
        if (elem) return type = (type || "fx") + "queue", queue = jQuery._data(elem, type), data && (!queue || jQuery.isArray(data) ? queue = jQuery._data(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || [];
    }
};
