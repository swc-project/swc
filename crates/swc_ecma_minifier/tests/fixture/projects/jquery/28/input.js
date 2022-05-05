export const E = {
    queue: function (elem, type, data) {
        var queue;

        if (elem) {
            type = (type || "fx") + "queue";
            queue = jQuery._data(elem, type);

            // Speed up dequeue by getting out quickly if this is just a lookup
            if (data) {
                if (!queue || jQuery.isArray(data)) {
                    queue = jQuery._data(elem, type, jQuery.makeArray(data));
                } else {
                    queue.push(data);
                }
            }
            return queue || [];
        }
    },
};
